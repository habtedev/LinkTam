const moment = require('moment/moment')
const { dbConnections } = require('../db/dbConfig')
const jwt = require('jsonwebtoken')

const getPosts = async (req, res) => {
  try {
    const userInfo = req.userInfo
    if (!userInfo) return res.status(401).json({ message: 'Not logged in!' })
    const q = `
      SELECT p.*, u.id AS userId, u.name, u.profilePic 
      FROM posts AS p 
      JOIN users AS u ON u.id = p.userId 
      LEFT JOIN relationships AS r ON p.userId = r.followedUserId 
      WHERE r.followerUserId = ? OR p.userId = ? 
      ORDER BY p.createdAt DESC
    `
    dbConnections.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      return res.status(200).json(data)
    })
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
      // Set a default Cloudinary image URL if no image is uploaded
      img =
        'https://res.cloudinary.com/di3ll9dgt/image/upload/v1747205657/user_uploads/6/rj5vmpiudjwetluuggkq.png'
    }
    const desc = req.body.desc
    const q =
      'INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)'
    const values = [
      desc,
      img,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
    ]
    dbConnections.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      return res.status(200).json({ message: 'Post created successfully!' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = { getPosts, addPost }
