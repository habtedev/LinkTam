const express = require('express')
const {
  getPosts,
  addPost,
  deletePost,
  updatePost,
} = require('../controller/post')

const router = express.Router()

router.get('/', getPosts)
router.post('/', addPost)
router.delete('/:id', deletePost)
router.put('/:id', updatePost)

module.exports = router
