// middleware/auth.js
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: 'Not logged in!' })

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json({ message: 'Token is not valid!' })
    req.userInfo = userInfo
    next()
  })
}

module.exports = { verifyToken }
