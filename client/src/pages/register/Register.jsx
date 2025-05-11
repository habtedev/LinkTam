import { Link } from 'react-router-dom'
import './register.scss'
import Headerlogin from '../headerLogin/Headerlogin'
import { useState } from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const Register = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar('Passwords do not match!', { variant: 'error' })
      return
    }
    // password strength
    if (formData.password.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters!', {
        variant: 'error',
      })
      return
    }
    // email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      enqueueSnackbar('Invalid email format!', { variant: 'error' })
      return
    }
    // username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      enqueueSnackbar(
        'Username must be 3-20 characters and contain only letters, numbers, or underscores.',
        { variant: 'error' },
      )
      return
    }
    // name format
    if (formData.name.length < 2) {
      enqueueSnackbar('Name must be at least 2 characters.', {
        variant: 'error',
      })
      return
    }
    try {
      // Sending request to backend to register the user
      await axios.post('http://localhost:8600/api/auth/register', formData)
      enqueueSnackbar('Registration Successful! Please Login.', {
        variant: 'success',
      })
      setFormData({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
      })
      setError('')
    } catch (err) {
      // Check if error response exists
      if (err.response && err.response.data) {
        const errorMessage =
          err.response.data.error ||
          err.response.data.message ||
          'Something went wrong'
        // Check if both username and email are already taken
        const usernameTaken = errorMessage.toLowerCase().includes('username')
        const emailTaken = errorMessage.toLowerCase().includes('email')
        if (usernameTaken && emailTaken) {
          enqueueSnackbar('User already exists! Please login ', { variant: 'error' })
        } else {
          if (usernameTaken) {
            enqueueSnackbar(
              'Username already exists! Please choose a different one.',
              { variant: 'error' },
            )
          }
          if (emailTaken) {
            enqueueSnackbar(
              'Email already exists! Please use a different email address.',
              { variant: 'error' },
            )
          }
        }
        setError(errorMessage)
      } else {
        const fallbackMessage = 'Something went wrong. Please try again.'
        enqueueSnackbar(fallbackMessage, { variant: 'error' })
        setError(fallbackMessage)
      }
    }
  }

  return (
    <>
      <Headerlogin />
      <div className="register">
        <div className="card">
          <div className="left">
            <h1>Welcome to LinkTam</h1>
            <p>Welcome to our platform where you can share your habits</p>
            <span>Do you have an account?</span>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>

          <div className="right">
            <h1>Register</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="submit">Register</button>
            </form>

            <div className="mobile-login-link">
              <span>Already have an account?</span>
              <Link to="/login">
                <button>Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
