const { dbConnections } = require('../db/dbConfig')

// Follow a user
exports.followUser = (req, res) => {
  const followerId = req.userInfo.id
  const followedId = parseInt(req.params.userId)
  if (followerId === followedId) {
    return res.status(400).json({ message: "You can't follow yourself!" })
  }
  dbConnections.query(
    'INSERT IGNORE INTO follows (followerId, followedId) VALUES (?, ?)',
    [followerId, followedId],
    (err) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      res.status(201).json({ message: 'Followed successfully!' })
    },
  )
}

// Unfollow a user
exports.unfollowUser = (req, res) => {
  const followerId = req.userInfo.id
  const followedId = parseInt(req.params.userId)
  dbConnections.query(
    'DELETE FROM follows WHERE followerId = ? AND followedId = ?',
    [followerId, followedId],
    (err) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      res.status(200).json({ message: 'Unfollowed successfully!' })
    },
  )
}

// Get follow state (does current user follow this user?)
exports.getFollowState = (req, res) => {
  const followerId = req.userInfo.id
  const followedId = parseInt(req.params.userId)
  dbConnections.query(
    'SELECT 1 FROM follows WHERE followerId = ? AND followedId = ?',
    [followerId, followedId],
    (err, data) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      res.status(200).json({ isFollowing: data.length > 0 })
    },
  )
}

// Get follower/following counts
exports.getFollowCounts = (req, res) => {
  const userId = parseInt(req.params.userId)
  dbConnections.query(
    'SELECT (SELECT COUNT(*) FROM follows WHERE followedId = ?) AS followers, (SELECT COUNT(*) FROM follows WHERE followerId = ?) AS following',
    [userId, userId],
    (err, data) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      res.status(200).json(data[0])
    },
  )
}
