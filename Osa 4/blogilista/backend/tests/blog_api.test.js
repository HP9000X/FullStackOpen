const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('getting blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have field "id" as identifyer', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
})

describe('creating blogs', () => {
  test('succeeds with valid data', async () => {
    const blogToAdd = {
      title: 'How to optimize a roomba',
      author: 'Alchemical transistor',
      url: 'roombing.com',
      likes: 10000,
    }

    await api
      .post('/api/blogs')
      .send(blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('How to optimize a roomba'))
  })

  test('no likes given', async () => {
    const blogToAdd = {
      title: 'Great view on animatronics',
      author: 'Pink guy',
      url: 'fnaflorelovers.co.uk',
    }

    await api
      .post('/api/blogs')
      .send(blogToAdd)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(titles.includes('Great view on animatronics'))
  })

  test('no title given', async () => {
    const blogToAdd = {
      author: 'Canary in the diamond mines',
      url: 'gavinsspot.net',
      likes: 2,
    }

    await api.post('/api/blogs').send(blogToAdd).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('no url given', async () => {
    const blogToAdd = {
      title: 'Intelligence is overrated',
      author: 'Max Luthor',
      likes: 1,
    }

    await api.post('/api/blogs').send(blogToAdd).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deleting blogs', () => {
  test('success with code 204 when id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('editing blogs', () => {
  test('editing amount of likes works', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    const newLikes = { likes: blogToEdit.likes + 100 }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(newLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await helper.blogInDb(blogToEdit.id)
    assert.strictEqual(blogAtEnd.likes, blogToEdit.likes + 100)
  })
})

after(async () => {
  await mongoose.connection.close()
})
