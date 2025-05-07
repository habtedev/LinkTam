import { Link } from 'react-router-dom'
import './register.scss'
import Headerlogin from '../headerLogin/Headerlogin'

const Register = () => {
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
            <form>
              <input type="text" placeholder="Username" required />
              <input type="email" placeholder="Email" required />
              <input type="text" placeholder="Name" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
              <button type="submit">Register</button>
            </form>

            {/* ✅ Login link for mobile only */}
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
