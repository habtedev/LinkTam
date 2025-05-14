// controller/user.js
const cloudinary = require('../utils/cloudinary')
const { dbConnections } = require('../db/dbConfig')

const uploadProfilePic = async (req, res) => {
  try {
    const url = req.file.path
    const q = 'UPDATE users SET profilePic = ? WHERE id = ?'
    dbConnections.query(q, [url, req.userInfo.id], (err) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      return res.status(200).json({ profilePic: url })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const uploadBackgroundPic = async (req, res) => {
  try {
    const url = req.file.path
    const q = 'UPDATE users SET coverPic = ? WHERE id = ?'
    dbConnections.query(q, [url, req.userInfo.id], (err) => {
      if (err)
        return res.status(500).json({ message: 'Database error', error: err })
      return res.status(200).json({ coverPic: url })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getUserById = (req, res) => {
  const userId = req.params.id
  const q = 'SELECT id, name, profilePic, coverPic FROM users WHERE id = ?'
  dbConnections.query(q, [userId], (err, data) => {
    if (err)
      return res.status(500).json({ message: 'Database error', error: err })
    if (data.length === 0)
      return res.status(404).json({ message: 'User not found' })
    return res.status(200).json(data[0])
  })
}

module.exports = {
  uploadProfilePic,
  uploadBackgroundPic,
  getUserById,
}
