// routes/userRoutes.js
const express = require('express')
const { registerUser, loginUser, logOut} = require('../controller/auth')

const router = express.Router()

// Register Route
router.post('/register', registerUser)


router.post('/login', loginUser)


router.post('/logout', logOut)

module.exports = router
