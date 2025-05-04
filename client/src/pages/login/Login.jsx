import { Link } from 'react-router-dom'
import './login.scss'
import HeaderLogin from '../headerLogin/Headerlogin'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const Login = () => {
const { login } = useContext(AuthContext)

const handleLogin = () => {
  login()
}

  return (
    <>
      <HeaderLogin />
      <div className="login">
        <div className="card">
          <div className="left">
            <h1>share your habits</h1>
            <p> welcome to our platform where you can share your habits </p>
            <span>Don't have an account?</span>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
          <div className="right">
            <h1>Login</h1>
            <form>
              <input type="text" placeholder="username" />
              <input type="password" placeholder="password" />
              <button type="submit" onClick={handleLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login