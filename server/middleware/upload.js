// middleware/upload.js
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'user_uploads'
    if (req.userInfo && req.userInfo.id) {
      folder = `user_uploads/${req.userInfo.id}`
    }
    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    }
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: (req, file, cb) => {
      // Set max size for coverPic to 4MB, profilePic to 2MB, others to 2MB
      if (file.fieldname === 'coverPic' || file.fieldname === 'backgroundPic') {
        cb(null, 4 * 1024 * 1024) // 4MB
      } else if (file.fieldname === 'profilePic') {
        cb(null, 2 * 1024 * 1024) // 2MB
      } else {
        cb(null, 2 * 1024 * 1024) // 2MB
      }
    },
  },
})

module.exports = upload
