import { Link, useNavigate } from 'react-router-dom'
import './login.scss'
import HeaderLogin from '../headerLogin/Headerlogin'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from 'react'
import { useSnackbar } from 'notistack'

const Login = () => {
 const navigate = useNavigate()


  const [formData, setFormData] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return

    // Client-side validation
    const username = formData.username.trim()
    const password = formData.password.trim()
    if (!username || !password) {
      enqueueSnackbar('Username and password are required.', { variant: 'warning' })
      return
    }
    if (username.length < 3) {
      enqueueSnackbar('Username must be at least 3 characters.', { variant: 'warning' })
      return
    }
    if (password.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters.', { variant: 'warning' })
      return
    }

    setLoading(true)
    try {
      const response = await login({ username, password })

      if (response?.userNotFound) {
        enqueueSnackbar('User not found. Please check your username.', { variant: 'error' })
        setLoading(false)
        return
      }

      if (response?.passwordMismatch) {
        enqueueSnackbar('Incorrect password. Please try again.', { variant: 'error' })
        setLoading(false)
        return
      }

      enqueueSnackbar(`Welcome back, ${username}!`, { variant: 'success' })
      navigate ('/')
      setFormData({ username: '', password: '' }) // Clear form
    } catch (err) {
      setLoading(false)
      const errorResponse = err.response?.data
      if (errorResponse) {
        let errorMessage = 'An unexpected error occurred. Please try again.'
        if (typeof errorResponse === 'string') {
          errorMessage = 'Login failed. Please check your credentials and try again.'
        } else {
          errorMessage = errorResponse.error || errorResponse.message || errorMessage
        }
        const variant = errorResponse.variant || 'error'
        enqueueSnackbar(errorMessage, { variant })
      } else {
        enqueueSnackbar('Network error. Please check your connection.', { variant: 'error' })
      }
    }
  }

  return (
    <>
      <HeaderLogin />
      <div className="login">
        <div className="card">
          <div className="left">
            <h1>Welcome Back!</h1>
            <p>Join our community and share your habits with others.</p>
            <span>Don't have an account?</span>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
          <div className="right">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoFocus
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mobile-register-link">
              <span>New here?</span>
              <Link to="/register">
                <button>Create a New Account</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login