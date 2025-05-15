const dotenv = require('dotenv')
const express = require('express')
const userRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const userRoutes = require('./routes/user')
const commentRoutes = require('./routes/comments')
const likeRoutes = require('./routes/likes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const app = express()

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', true)
  next()
})
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(cookieParser()) // Corrected middleware call

// Middleware to decode JWT and attach userInfo to req for file upload
app.use((req, res, next) => {
  if (req.cookies && req.cookies.access_token) {
    try {
      const jwt = require('jsonwebtoken')
      req.userInfo = jwt.verify(
        req.cookies.access_token,
        process.env.JWT_SECRET_KEY,
      )
    } catch (e) {
      req.userInfo = {}
    }
  }
  next()
})

// Set up Cloudinary storage for uploaded images with per-user folders
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'user_uploads'
    if (req.userInfo && req.userInfo.id) {
      folder = `user_uploads/${req.userInfo.id}`
    }
    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    }
  },
})

// Multer upload with file size limit (2MB)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
})

// Serve uploaded images statically (all user folders)
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Database connection (ensure correct import)
const dbConnections = require('./db/dbConfig')

// Routes
app.use('/api/auth', userRoute)
app.use('/api/posts', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        return res
          .status(400)
          .json({ message: 'File upload error', error: err.message })
      } else if (err) {
        // Other errors (invalid type, size, etc)
        return res
          .status(400)
          .json({ message: 'Invalid file type or size', error: err.message })
      }
      next()
    })
  } else {
    next()
  }
})
app.use('/api/posts', postRoute)
app.use('/api/users', userRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/likes', likeRoutes)

const port = process.env.PORT || 5000

app.listen(port, (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log(`Server is running on port ${port}`)
  }
})
