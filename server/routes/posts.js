const express = require('express')
const { getPosts, addPost } = require('../controller/post')

const router = express.Router()

router.get('/', getPosts)
router.post('/', addPost)

module.exports = router
