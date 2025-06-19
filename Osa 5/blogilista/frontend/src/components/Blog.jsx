import { useState } from 'react'
import blogServices from '../services/blogs'
import { jwtDecode } from 'jwt-decode'

const Blog = ({ blog, updateBlogsList }) => {
  const [visible, setVisibility] = useState(false)
  const [currentBlog, setCurrentBlog] = useState(blog)

  const getUserIdFromToken = () => {
    const token = window.localStorage.getItem('loggedBlogappUser')
    if (token) {
      const decodedToken = jwtDecode(token)
      return decodedToken.id
    }
    return null
  }

  const showRemove = currentBlog.user.id === getUserIdFromToken()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const likeBlog = async () => {
    const currentBlogUpdated = {
      title: currentBlog.title,
      author: currentBlog.author,
      url: currentBlog.url,
      likes: currentBlog.likes + 1,
      user: currentBlog.user.id,
    }

    await blogServices.update(currentBlog.id, currentBlogUpdated)
    const updatedBlog = await blogServices.getOne(currentBlog.id)
    console.log(updatedBlog.likes)
    setCurrentBlog(updatedBlog)
  }

  const removeBlog = async () => {
    if (
      window.confirm(
        `Remove blog ${currentBlog.title} by ${currentBlog.author}`
      )
    ) {
      await blogServices.remove(currentBlog.id)
      updateBlogsList()
    }
  }

  return (
    <div style={blogStyle}>
      {currentBlog.title} {currentBlog.author}{' '}
      <button onClick={() => toggleVisibility()}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <div>{currentBlog.url}</div>
          <div>
            likes {currentBlog.likes} <button onClick={likeBlog}>like</button>
          </div>
          <div>{currentBlog.user.username}</div>
          {showRemove && (
            <div>
              <button onClick={removeBlog}>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
