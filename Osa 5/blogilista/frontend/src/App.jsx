import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
    } else {
      window.localStorage.removeItem('loggedBlogappUser')
    }
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      })

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)

      setMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorNotification message={errorMessage}></ErrorNotification>
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        ></LoginForm>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage}></ErrorNotification>
      <Notification message={message}></Notification>
      <div>
        {user.username} logged in
        <button onClick={handleLogOut}>logout</button>
      </div>
      <NewBlogForm
        title={title}
        author={author}
        url={url}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
        handleNewBlog={handleNewBlog}
      ></NewBlogForm>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
