const express = require('express')
const router = express.Router()
const commentController = require('../controller/comment')

// Get comments for a post
router.get('/:postId', commentController.getComments)

// Add a new comment
router.post('/', commentController.addComment)

// Delete a comment
router.delete('/:id', commentController.deleteComment)

module.exports = router
