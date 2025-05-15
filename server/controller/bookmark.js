const { dbConnections } = require('../db/dbConfig')

// Add a bookmark
exports.addBookmark = (req, res) => {
  const userId = req.userInfo.id
  const postId = parseInt(req.body.postId)
  console.log('[BOOKMARK] addBookmark', { userId, postId }) // DEBUG
  dbConnections.query(
    'INSERT IGNORE INTO bookmarks (userId, postId) VALUES (?, ?)',
    [userId, postId],
    (err) => {
      if (err) {
        console.log('[BOOKMARK ERROR] addBookmark', err) // DEBUG
        return res.status(500).json({ message: 'Database error', error: err })
      }
      res.status(201).json({ message: 'Post bookmarked!' })
    },
  )
}

// Remove a bookmark
exports.removeBookmark = (req, res) => {
  const userId = req.userInfo.id
  const postId = parseInt(req.params.postId)
  console.log('[BOOKMARK] removeBookmark', { userId, postId }) // DEBUG
  dbConnections.query(
    'DELETE FROM bookmarks WHERE userId = ? AND postId = ?',
    [userId, postId],
    (err) => {
      if (err) {
        console.log('[BOOKMARK ERROR] removeBookmark', err) // DEBUG
        return res.status(500).json({ message: 'Database error', error: err })
      }
      res.status(200).json({ message: 'Bookmark removed!' })
    },
  )
}

// Get all bookmarked postIds for a user
exports.getBookmarks = (req, res) => {
  const userId = req.userInfo.id
  console.log('[BOOKMARK] getBookmarks', { userId }) // DEBUG
  dbConnections.query(
    'SELECT postId FROM bookmarks WHERE userId = ?',
    [userId],
    (err, data) => {
      if (err) {
        console.log('[BOOKMARK ERROR] getBookmarks', err) // DEBUG
        return res.status(500).json({ message: 'Database error', error: err })
      }
      res.status(200).json(data.map((row) => row.postId))
    },
  )
}
