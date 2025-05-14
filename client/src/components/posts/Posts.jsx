import { makeRequest } from '../../axios'
import Post from '../post/Post'
import './posts.scss'
import { useQuery } from '@tanstack/react-query'

const Posts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeRequest.get('/posts').then((res) => res.data),
  })

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
        <Post post={post} key={post.id} />
      ))}
    </div>
  )
}

export default Posts
