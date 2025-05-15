const { dbConnections } = require('../db/dbConfig')

// Get comments for a post
exports.getComments = (req, res) => {
  const postId = req.params.postId
  const userId = req.userInfo?.id
  dbConnections.query(
    `SELECT c.*, u.name, u.profilePic, 
      (SELECT COUNT(*) FROM relationships r WHERE (r.followerUserId = ? AND r.followedUserId = u.id) OR (r.followerUserId = u.id AND r.followedUserId = ?)) AS isRelated
     FROM comments c 
     JOIN users u ON c.userId = u.id 
     WHERE c.postId = ?
       AND (
         c.userId = ?
         OR EXISTS (SELECT 1 FROM relationships r1 WHERE r1.followerUserId = ? AND r1.followedUserId = c.userId)
         OR EXISTS (SELECT 1 FROM relationships r2 WHERE r2.followerUserId = c.userId AND r2.followedUserId = ?)
       )
     ORDER BY c.createdAt DESC`,
    [userId, userId, postId, userId, userId, userId],
    (err, data) => {
      if (err)
        return res.status(500).json({ error: 'Database error', details: err })
      res.status(200).json(data)
    },
  )
}

// Add a new comment
exports.addComment = (req, res) => {
  const { postId, userId, desc } = req.body
  if (!desc || !postId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  dbConnections.query(
    'INSERT INTO comments (`desc`, createdAt, userId, postId) VALUES (?, NOW(), ?, ?)',
    [desc, userId, postId],
    (err, result) => {
      if (err) {
        console.error('Error inserting comment:', err) // Log error to terminal
        return res.status(500).json({ error: 'Database error', details: err })
      }
      // Return the new comment with user info
      dbConnections.query(
        'SELECT c.*, u.name, u.profilePic FROM comments c JOIN users u ON c.userId = u.id WHERE c.id = ?',
        [result.insertId],
        (err2, data) => {
          if (err2) {
            console.error('Error fetching new comment:', err2) // Log error to terminal
            return res
              .status(500)
              .json({ error: 'Database error', details: err2 })
          }
          res.status(201).json(data[0])
        },
      )
    },
  )
}

// Delete a comment
exports.deleteComment = (req, res) => {
  const commentId = req.params.id
  const userInfo = req.userInfo
  if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
  dbConnections.query(
    'DELETE FROM comments WHERE id = ? AND userId = ?',
    [commentId, userInfo.id],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: 'Database error', details: err })
      if (result.affectedRows === 0)
        return res
          .status(403)
          .json({ message: 'You can only delete your own comments.' })
      res.status(200).json({ message: 'Comment deleted successfully!' })
    },
  )
}
