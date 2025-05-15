// router/user.js
const express = require('express')
const router = express.Router()
const {
  uploadProfilePic,
  uploadBackgroundPic,
  getUserById,
  updateUserName,
} = require('../controller/user')
const { verifyToken } = require('../middleware/auth')
const upload = require('../middleware/upload')

// Upload profile picture
router.post(
  '/profile-pic',
  verifyToken,
  upload.single('profilePic'),
  uploadProfilePic,
)

// Upload background picture
router.post(
  '/background-pic',
  verifyToken,
  upload.single('backgroundPic'),
  uploadBackgroundPic,
)

// Get user by id
router.get('/:id', getUserById)

// Update user name
router.put('/:id', verifyToken, updateUserName)

module.exports = router
