import { Link } from 'react-router-dom'
import './login.scss'
import HeaderLogin from '../headerLogin/Headerlogin'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const Login = () => {
  const { login } = useContext(AuthContext)

  const handleLogin = (e) => {
    e.preventDefault()
    login()
  }

  return (
    <>
      <HeaderLogin />
      <div className="login">
        <div className="card">
          <div className="left">
            <h1>Share Your Habits</h1>
            <p>Welcome to our platform where you can share your habits.</p>
            <span>Don't have an account?</span>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
          <div className="right">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">Login</button>
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
