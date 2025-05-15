const express = require('express')
const router = express.Router()
const likeController = require('../controller/like')
const { verifyToken } = require('../middleware/auth')

// Get likes for a post
router.get('/:postId', likeController.getLikes)
// Like a post
router.post('/', verifyToken, likeController.addLike)
// Unlike a post
router.delete('/:postId', verifyToken, likeController.deleteLike)

module.exports = router
