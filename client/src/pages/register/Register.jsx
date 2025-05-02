import { Link } from 'react-router-dom'
import './register.scss'
import Headerlogin from '../headerLogin/Headerlogin'

const Register = () => {
  return (
    <>
    <Headerlogin/>
      <div className="register">
        <div className="card">
          <div className="left">
            <h1>Welcom to LinkTam</h1>
            <p> welcome to our platform where you can share your habits </p>
            <span>Do have an account?</span>
            <Link to='/login'>
              <button>Login</button>
            </Link>
          </div>
          <div className="right">
            <h1>Register</h1>
            <form>
              <input type="text" placeholder="username" />
              <input type="email" placeholder="email" />
              <input type="password" placeholder="password" />
              <input type="password" placeholder="confirm password" />
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
