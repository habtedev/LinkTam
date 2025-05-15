const express = require('express')
const router = express.Router()
const followController = require('../controller/follow')
const { verifyToken } = require('../middleware/auth')

// Follow a user
router.post('/:userId', verifyToken, followController.followUser)
// Unfollow a user
router.delete('/:userId', verifyToken, followController.unfollowUser)
// Get follow state (does current user follow this user?)
router.get('/state/:userId', verifyToken, followController.getFollowState)
// Get follower/following counts
router.get('/counts/:userId', followController.getFollowCounts)

module.exports = router
