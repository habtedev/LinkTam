import { makeRequest } from '../../axios'
import Post from '../post/Post'
import Likes from '../likes/Likes'
import './posts.scss'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const Posts = () => {
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeRequest.get('/posts').then((res) => res.data),
  })

  const handleOptimisticDelete = (postId) => {
    // Optimistically remove the post from the UI
    queryClient.setQueryData(['posts'], (old) =>
      old ? old.filter((p) => p.id !== postId) : [],
    )
    // Send delete request
    makeRequest.delete(`/posts/${postId}`).catch(() => {
      // On error, refetch posts to restore
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    })
  }

  const handleUpdate = async (postId, newDesc, newFile, prevImg) => {
    const formData = new FormData()
    formData.append('desc', newDesc)
    if (newFile && newFile !== 'REMOVE') formData.append('file', newFile)
    if (newFile === 'REMOVE') formData.append('removeImg', 'true')
    if (prevImg) formData.append('prevImg', prevImg)
    await makeRequest.put(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }

  console.log(data)
  return (
    <div className="posts">
      {isLoading && <div>Loading posts...</div>}
      {error && <div style={{ color: 'red' }}>Failed to load posts.</div>}
      {Array.isArray(data) && data.length === 0 && !isLoading && !error && (
        <div className="no-posts-card">
          <img
            src="https://res.cloudinary.com/di3ll9dgt/image/upload/v1747205657/user_uploads/6/rj5vmpiudjwetluuggkq.png"
            alt="No posts yet"
            className="no-posts-image"
          />
          <div className="no-posts-message">
            No posts yet. Start the conversation!
          </div>
        </div>
      )}
      {data?.map((post) => (
        <Post
          post={post}
          key={post.id}
          onDelete={handleOptimisticDelete}
          onUpdate={handleUpdate}
        >
          <Likes postId={post.id} />
        </Post>
      ))}
    </div>
  )
}

export default Posts
