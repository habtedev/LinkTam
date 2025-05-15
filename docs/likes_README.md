// Modern Like API for MySQL
// POST /api/likes { postId } (like a post)
// DELETE /api/likes/:postId (unlike a post)
// GET /api/likes/:postId (get userIds who liked)

// Usage:
// - Backend: see server/controller/like.js, server/routes/likes.js
// - Frontend: see client/src/components/likes/Likes.jsx
// - Table: see server/db/createLikesTable.sql

// To add likes to a new page/component:
// 1. Import Likes from '../likes/Likes'
// 2. Use <Likes postId={post.id} /> wherever you want the like button/count
// 3. Style with .like-btn in likes.scss
