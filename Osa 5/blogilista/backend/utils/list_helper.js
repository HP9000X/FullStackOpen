const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach((blog) => {
    total += blog.likes
  })
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikedBlog = lodash.maxBy(blogs, 'likes')

  return mostLikedBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {
      author: null,
      blogs: null,
    }
  }

  const extractedAuthors = blogs.map((blog) => {
    return blog.author
  })

  const authorCounts = lodash.countBy(extractedAuthors)

  let mostBlogsMade = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b
  )

  return {
    author: mostBlogsMade,
    blogs: authorCounts[mostBlogsMade],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {
      author: null,
      likes: 0,
    }
  }

  const authorToLikes = {}
  blogs.forEach((blog) => {
    if (!authorToLikes[blog.author]) {
      authorToLikes[blog.author] = 0
    }
    authorToLikes[blog.author] += blog.likes
  })

  let topAuthor = null
  let maxLikes = -Infinity

  for (const [author, likes] of Object.entries(authorToLikes)) {
    if (likes > maxLikes) {
      maxLikes = likes
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
