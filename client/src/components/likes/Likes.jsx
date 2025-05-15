import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import './likes.scss'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Likes = ({ postId }) => {
  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const { data: likes = [], isLoading } = useQuery({
    queryKey: ['likes', postId],
    queryFn: () => makeRequest.get(`/likes/${postId}`).then((res) => res.data),
  })
  const hasLiked = likes.includes(currentUser.id)

  const likeMutation = useMutation({
    mutationFn: () => makeRequest.post('/likes', { postId }),
    onSuccess: () => queryClient.invalidateQueries(['likes', postId]),
  })
  const unlikeMutation = useMutation({
    mutationFn: () => makeRequest.delete(`/likes/${postId}`),
    onSuccess: () => queryClient.invalidateQueries(['likes', postId]),
  })

  const handleLike = (e) => {
    e.stopPropagation()
    if (hasLiked) {
      unlikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  return (
    <button
      className={`like-btn${hasLiked ? ' liked' : ''}`}
      onClick={handleLike}
      title={hasLiked ? 'Unlike' : 'Like'}
      aria-label={hasLiked ? 'Unlike' : 'Like'}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s',
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleLike(e)
      }}
    >
      {hasLiked ? (
        <FavoriteIcon
          style={{
            color: 'red',
            fontSize: '1.7rem',
            filter: 'drop-shadow(0 2px 6px #ffb3b3)',
          }}
        />
      ) : (
        <FavoriteBorderIcon
          style={{
            color: '#64748b',
            fontSize: '1.7rem',
            filter: 'drop-shadow(0 2px 6px #e2e8f0)',
          }}
        />
      )}
      <span
        className="like-count"
        style={{
          fontWeight: 500,
          fontSize: '1.1rem',
          color: hasLiked ? '#e11d48' : '#64748b',
          marginLeft: 2,
          minWidth: 18,
          textAlign: 'left',
          letterSpacing: 0.5,
        }}
      >
        {likes.length > 0 ? likes.length : ''}
      </span>
    </button>
  )
}

export default Likes
