const express = require('express')
const router = express.Router()
const bookmarkController = require('../controller/bookmark')
const { verifyToken } = require('../middleware/auth')

// Add a bookmark
router.post('/', verifyToken, bookmarkController.addBookmark)
// Remove a bookmark
router.delete('/:postId', verifyToken, bookmarkController.removeBookmark)
// Get all bookmarks for current user
router.get('/', verifyToken, bookmarkController.getBookmarks)

module.exports = router
