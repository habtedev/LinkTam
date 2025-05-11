const dotenv = require('dotenv')
const express = require('express')
const userRoute = require('./routes/auth') // Corrected import
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

dotenv.config()

// Middleware
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', true)
  next()
})
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow credentials like cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  }),
)
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
