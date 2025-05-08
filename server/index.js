const dotenv = require('dotenv')
const express = require('express')
const userRoute = require('./routes/auth') // Corrected import
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

dotenv.config()

// Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser()) // Corrected middleware call

// Database connection (ensure correct import)
const dbConnections = require('./db/dbConfig')

// Routes
app.use('/api/auth', userRoute)

const port = process.env.PORT || 5000

app.listen(port, (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log(`Server is running on port ${port}`)
  }
})
