const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const users = helper.initialUsers

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash,
    })

    await newUser.save()
  }
})

describe('Adding users', () => {
  test('adding user with correct data succeeds', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      username: 'Olivia Rodriguez',
      name: 'Olivia Rodriguez',
      password: 'BombardinoCrocodilo',
    }

    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes('Olivia Rodriguez'))
  })

  test('adding user with too short password fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      username: 'Olivia Rodriguez',
      name: 'Olivia Rodriguez',
      password: 'Bo',
    }

    const result = await api.post('/api/users').send(userToAdd).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(!usernames.includes('Olivia Rodriguez'))

    assert(
      result.body.error.includes(
        'Password is required and must be at least 3 characters long'
      )
    )
  })

  test('adding user with no password fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      username: 'Olivia Rodriguez',
      name: 'Olivia Rodriguez',
    }

    const result = await api.post('/api/users').send(userToAdd).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(!usernames.includes('Olivia Rodriguez'))

    assert(
      result.body.error.includes(
        'Password is required and must be at least 3 characters long'
      )
    )
  })

  test('adding user with too short username fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      username: 'Ol',
      name: 'Olivia Rodriguez',
      password: 'BombardinoCrocodilo',
    }

    const result = await api.post('/api/users').send(userToAdd).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(!usernames.includes('Ol'))

    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` (`Ol`) is shorter than the minimum allowed length (3).'
      )
    )
  })

  test('adding user with no username fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      name: 'Olivia Rodriguez',
      password: 'BombardinoCrocodilo',
    }

    const result = await api.post('/api/users').send(userToAdd).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    const names = usersAtEnd.map((user) => user.name)
    assert(!names.includes('Olivia Rodriguez'))

    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` is required.'
      )
    )
  })

  test('adding user with existing username fails', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToAdd = {
      username: 'Oliver123',
      name: 'Oliver Sanchez',
      password: 'TralaleroTralala',
    }

    const result = await api.post('/api/users').send(userToAdd).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    assert(result.body.error.includes('expected `username` to be unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
