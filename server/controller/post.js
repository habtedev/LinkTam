const moment = require('moment/moment')
const { dbConnections } = require('../db/dbConfig')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

const getPosts = async (req, res) => {
  try {
    const userInfo = req.userInfo
    if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
    const q = `
      SELECT p.*, u.id AS userId, u.name, u.profilePic,
        (SELECT COUNT(*) FROM comments c WHERE c.postId = p.id) AS commentCount,
        (SELECT COUNT(*) FROM relationships r WHERE (r.followerUserId = ? AND r.followedUserId = u.id) OR (r.followerUserId = u.id AND r.followedUserId = ?)) AS isRelated
      FROM posts AS p 
      JOIN users AS u ON u.id = p.userId 
      WHERE p.userId = ?
        OR EXISTS (SELECT 1 FROM relationships r1 WHERE r1.followerUserId = ? AND r1.followedUserId = p.userId)
        OR EXISTS (SELECT 1 FROM relationships r2 WHERE r2.followerUserId = p.userId AND r2.followedUserId = ?)
      ORDER BY p.createdAt DESC
    `
    dbConnections.query(
      q,
      [userInfo.id, userInfo.id, userInfo.id, userInfo.id, userInfo.id],
      (err, data) => {
        if (err)
          return res.status(500).json({ message: 'Database error', error: err })
        return res.status(200).json(data)
      },
    )
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const addPost = async (req, res) => {
  try {
    const userInfo = req.userInfo
    if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
    let img = ''
    if (req.file && req.file.path) {
      img = req.file.path // Cloudinary URL
    } else {
      img = null // No default image if not provided
    }
    const desc = req.body.desc
    const insertValues = [
      desc,
      img,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
    ]
    dbConnections.query(
      'INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)',
      insertValues,
      (err, data) => {
        if (err)
          return res.status(500).json({ message: 'Database error', error: err })
        return res.status(200).json({ message: 'Post created successfully!' })
      },
    )
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

const deletePost = (req, res) => {
  const postId = req.params.id
  const userInfo = req.userInfo
  if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
  // Get post image URL before deleting
  dbConnections.query(
    'SELECT img FROM posts WHERE id = ? AND userId = ?',
    [postId, userInfo.id],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Error finding post', error: err })
      const imgUrl = rows && rows[0] && rows[0].img
      // First, delete comments for this post
      dbConnections.query(
        'DELETE FROM comments WHERE postId = ?',
        [postId],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: 'Error deleting comments', error: err })
          // Then, delete the post itself (only if user is owner)
          dbConnections.query(
            'DELETE FROM posts WHERE id = ? AND userId = ?',
            [postId, userInfo.id],
            async (err2, result) => {
              if (err2)
                return res
                  .status(500)
                  .json({ message: 'Error deleting post', error: err2 })
              if (result.affectedRows === 0)
                return res
                  .status(403)
                  .json({ message: 'You can only delete your own posts.' })
              // Delete image from Cloudinary if exists
              if (imgUrl && imgUrl.includes('cloudinary.com')) {
                try {
                  const publicId = imgUrl.split('/').slice(-1)[0].split('.')[0]
                  await cloudinary.uploader.destroy(
                    `user_uploads/${userInfo.id}/${publicId}`,
                  )
                } catch (e) {
                  /* ignore cloudinary errors */
                }
              }
              return res.status(200).json({
                message: 'Post and its comments deleted successfully!',
              })
            },
          )
        },
      )
    },
  )
}

const updatePost = async (req, res) => {
  try {
    const userInfo = req.userInfo
    if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
    const postId = req.params.id
    const desc = req.body.desc
    let img = null
    let removeImg = req.body.removeImg === 'true'
    let prevImg = req.body.prevImg
    // If new file uploaded, upload to Cloudinary
    if (req.file && req.file.path) {
      img = req.file.path
      // Remove previous image from Cloudinary if exists
      if (prevImg && prevImg.includes('cloudinary.com')) {
        try {
          const publicId = prevImg.split('/').slice(-1)[0].split('.')[0]
          await cloudinary.uploader.destroy(
            `user_uploads/${userInfo.id}/${publicId}`,
          )
        } catch (e) {
          /* ignore cloudinary errors */
        }
      }
    } else if (removeImg && prevImg && prevImg.includes('cloudinary.com')) {
      // Remove image if requested
      try {
        const publicId = prevImg.split('/').slice(-1)[0].split('.')[0]
        await cloudinary.uploader.destroy(
          `user_uploads/${userInfo.id}/${publicId}`,
        )
      } catch (e) {
        /* ignore cloudinary errors */
      }
      img = null
    } else {
      img = prevImg
    }
    dbConnections.query(
      'UPDATE posts SET `desc` = ?, `img` = ? WHERE id = ? AND userId = ?',
      [desc, img, postId, userInfo.id],
      (err, result) => {
        if (err)
          return res.status(500).json({ message: 'Database error', error: err })
        if (result.affectedRows === 0)
          return res
            .status(403)
            .json({ message: 'You can only update your own posts.' })
        return res.status(200).json({ message: 'Post updated successfully!' })
      },
    )
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { getPosts, addPost, deletePost, updatePost }
