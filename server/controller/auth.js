// controllers/userController.js
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { dbConnections } = require('../db/dbConfig')
const jwt = require('jsonwebtoken')

// User Registration Controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, name } = req.body

    // Check for missing fields
    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check for existing user
    const [existingUsers] = await dbConnections
      .promise()
      .execute(
        'SELECT username, email FROM users WHERE username = ? OR email = ?',
        [username, email],
      )

    if (existingUsers.length > 0) {
      const existing = existingUsers[0]
      if (existing.username === username && existing.email === email) {
        return res
          .status(409)
          .json({ error: 'Username and email already registered' })
      } else if (existing.username === username) {
        return res.status(409).json({ error: 'Username already taken' })
      } else if (existing.email === email) {
        return res.status(409).json({ error: 'Email already registered' })
      }
    }

    // Validate password strength
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user into the database
    await dbConnections
      .promise()
      .execute(
        'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, name],
      )

    return res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Registration error:', error.message)
    return res.status(500).json({ error: 'Server error' })
  }
}

// login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    // Check user in the database
    const [rows] = await dbConnections
      .promise()
      .execute('SELECT * FROM users WHERE username = ?', [username])

    // Log the result of the database query to check its structure
    console.log('Database query result:', rows)

    // Check if the result is an array and has the expected structure
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found!' })
    }

    // Extract the user data from the result
    const data = rows[0]

    // Check if the user exists in the data
    if (!data) {
      return res.status(404).json({ error: 'User not found!' })
    }

    // Check if the password matches
    const checkPassword = await bcrypt.compare(password, data.password)

    if (!checkPassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      { id: data.id },
      process.env.JWT_SECRET_KEY, // Use environment variable for secret key
      { expiresIn: '1d' }, // Token expiration time (1 day)
    )

    // Exclude password from the response data
    const { password: userPassword, ...userData } = data

    // Set the JWT token as an HTTP-only cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure flag in production
      sameSite: 'none', 
    })

    // Return user data without password
    return res.status(200).json(userData)
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ error: 'Server error' })
  }
}

const logOut = async (req, res) => {
  try {
    res.clearCookie('access_token', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    }).status(200).json({ message: 'user logged out successfully' })
  } catch (error) {
    console.log('logoout error:', error.message)
    res.status(500).json({ error: 'Server error' })
    
  }
}

module.exports = { registerUser, loginUser, logOut }
