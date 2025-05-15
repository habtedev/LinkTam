import React, { useEffect, useState } from 'react'
import { makeRequest } from '../../axios'
import Post from '../../components/post/Post'
import './bookmarks.scss'

const Bookmarks = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookmarks() {
      setLoading(true)
      const { data: bookmarkedIds } = await makeRequest.get('/bookmarks')
      if (bookmarkedIds.length === 0) {
        setPosts([])
        setLoading(false)
        return
      }
      // Fetch all posts by ids
      const { data: allPosts } = await makeRequest.get('/posts')
      setPosts(allPosts.filter((p) => bookmarkedIds.includes(p.id)))
      setLoading(false)
    }
    fetchBookmarks()
  }, [])

  return (
    <div className="bookmarks-page">
      <h2>Bookmarked Posts</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="empty">No bookmarks yet.</div>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  )
}

export default Bookmarks
