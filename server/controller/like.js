const { dbConnections } = require('../db/dbConfig')

// Get likes for a post
exports.getLikes = (req, res) => {
  const possId = req.params.postId // Use possId to match your DB
  dbConnections.query(
    'SELECT userId FROM likes WHERE possId = ?',
    [possId],
    (err, data) => {
      if (err) {
        console.error('GetLikes DB error:', err)
        return res.status(500).json({ error: 'Database error', details: err })
      }
      res.status(200).json(data.map((row) => row.userId))
    },
  )
}

// Add a like
exports.addLike = (req, res) => {
  const userId = req.userInfo && req.userInfo.id
  const possId = req.body.postId // Accepts postId from frontend, but uses possId in DB
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' })
  }
  dbConnections.query(
    'INSERT IGNORE INTO likes (userId, possId) VALUES (?, ?)',
    [userId, possId],
    (err) => {
      if (err) {
        console.error('AddLike DB error:', err)
        return res.status(500).json({ error: 'Database error', details: err })
      }
      res.status(201).json({ message: 'Post liked!' })
    },
  )
}

// Remove a like
exports.deleteLike = (req, res) => {
  const userId = req.userInfo && req.userInfo.id
  const possId = req.params.postId // Use possId to match your DB
  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' })
  }
  dbConnections.query(
    'DELETE FROM likes WHERE userId = ? AND possId = ?',
    [userId, possId],
    (err) => {
      if (err) {
        console.error('DeleteLike DB error:', err)
        return res.status(500).json({ error: 'Database error', details: err })
      }
      res.status(200).json({ message: 'Like removed!' })
    },
  )
}
