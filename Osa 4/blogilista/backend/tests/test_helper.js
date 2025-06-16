const Blog = require('../models/blog')

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

module.exports = {
  initialBlogs,
  blogsInDb,
  blogInDb,
}
