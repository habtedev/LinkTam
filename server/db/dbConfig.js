// db/dbConfig.js
require('dotenv').config()
const mysql = require('mysql2')

// Database Configuration
const dbConnections = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
})

// Test Database Connection
console.log('Testing database connection...')
dbConnections.execute("SELECT 'Connection successful'", (err, result) => {
  if (err) console.error('Database connection error:', err.message)
  else console.log(result[0])
})

module.exports = { dbConnections }
