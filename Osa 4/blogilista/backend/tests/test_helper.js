const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First blog!',
    author: 'Savila',
    url: 'hotsprings.com',
    likes: 4,
  },
  {
    title: 'cool title',
    author: 'Pasi Jääskeläinen',
    url: 'verycoolwebsite.com',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const blogInDb = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

const initialUsers = [
  {
    username: 'Oliver123',
    name: 'Oliver Sanchez',
    password: 'TralaleroTralala',
  },
  {
    username: 'xXx_SnIpErSlAyEr_xXx',
    name: 'Samantha Cromwell',
    password: 'TungTungTungSahur',
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  blogInDb,
  usersInDb,
}
