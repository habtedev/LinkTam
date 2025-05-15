import { useContext, useState, useRef } from 'react'
import './commets.scss'
import { AuthContext } from '../../context/AuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSnackbar } from 'notistack'
dayjs.extend(relativeTime)

const Comments = ({ postId, setCommentCount }) => {
  const { currentUser } = useContext(AuthContext)
  const [desc, setDesc] = useState('')
  const queryClient = useQueryClient()
  const inputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  // Fetch comments
  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () =>
      makeRequest
        .get(`/comments/${postId}`)
        .then((res) => res.data)
        .catch((err) => {
          console.error('Frontend fetch comments error:', err)
          throw err
        }),
    enabled: !!postId, // Only run if postId is valid
    onSuccess: (data) => {
      if (setCommentCount) setCommentCount(data.length)
    },
  })

  // Add comment mutation
  const mutation = useMutation({
    mutationFn: async (newComment) => {
      return makeRequest.post('/comments', newComment).catch((err) => {
        console.error('Frontend post comment error:', err)
        throw err
      })
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments =
        queryClient.getQueryData(['comments', postId]) || []
      const optimisticComment = {
        id: 'optimistic-' + Date.now(),
        desc: newComment.desc,
        userId: newComment.userId,
        postId: newComment.postId,
        name: currentUser.name,
        profilePic: currentUser.profilePic,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData(
        ['comments', postId],
        [optimisticComment, ...previousComments],
      )
      if (setCommentCount) setCommentCount(previousComments.length + 1)
      setDesc('')
      return { previousComments }
    },
    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments)
        if (setCommentCount) setCommentCount(context.previousComments.length)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  // Delete comment mutation (optimistic)
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      return makeRequest.delete(`/comments/${commentId}`)
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] })
      const previousComments =
        queryClient.getQueryData(['comments', postId]) || []
      queryClient.setQueryData(
        ['comments', postId],
        previousComments.filter((c) => c.id !== commentId),
      )
      if (setCommentCount) setCommentCount(previousComments.length - 1)
      return { previousComments }
    },
    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments)
        if (setCommentCount) setCommentCount(context.previousComments.length)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  const handleSend = (e) => {
    e.preventDefault()
    if (!desc.trim()) return
    mutation.mutate(
      {
        desc,
        postId,
        userId: currentUser.id,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus()
          }, 100)
        },
      },
    )
  }

  if (!postId) {
    return (
      <div className="comments">
        <div className="comment-error">
          Cannot load comments: postId is missing.
        </div>
      </div>
    )
  }

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePic || 'https://ui-avatars.com/api/?name=User'
          }
          alt=""
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a comment..."
          aria-label="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
        />
        <button
          onClick={handleSend}
          disabled={mutation.isLoading || !desc.trim()}
          title="Send comment"
          className="modern-share-btn"
          style={{
            background: 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 20px',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(79,140,255,0.15)',
            cursor:
              mutation.isLoading || !desc.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            marginLeft: '10px',
          }}
        >
          {mutation.isLoading ? (
            'Sending...'
          ) : (
            <>
              <svg
                style={{ marginRight: 6, verticalAlign: 'middle' }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Share
            </>
          )}
        </button>
      </div>
      {isLoading && (
        <div className="comment-loading">
          {/* Skeleton loader for comments */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="comment-skeleton"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#e3e8f0',
                  marginRight: 14,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: '30%',
                    height: 12,
                    background: '#e3e8f0',
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    width: '80%',
                    height: 14,
                    background: '#e3e8f0',
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {isError && (
        <div className="comment-error">
          Failed to load comments: {error?.message}
        </div>
      )}
      {!isLoading && !isError && comments?.length === 0 && (
        <div
          className="comment-empty"
          style={{ textAlign: 'center', color: '#888', margin: '24px 0' }}
        >
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#b0b8c1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: 8 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15h8M9 9h.01M15 9h.01" />
          </svg>
          <div>No comments yet. Be the first to start the conversation!</div>
        </div>
      )}
      {Array.isArray(comments) &&
        comments.map((comment) => (
          <div
            className="comment"
            key={comment.id}
            style={{ animation: 'fadeIn 0.4s' }}
          >
            <img
              src={
                comment.profilePic || 'https://ui-avatars.com/api/?name=User'
              }
              alt=""
            />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{dayjs(comment.createdAt).fromNow()}</span>
            {comment.userId === currentUser.id && (
              <button
                onClick={() => {
                  if (currentUser.id !== comment.userId) {
                    enqueueSnackbar('You can only delete your own comments.', {
                      variant: 'warning',
                    })
                    return
                  }
                  deleteMutation.mutate(comment.id)
                }}
                style={{
                  marginLeft: 10,
                  background: 'none',
                  border: 'none',
                  color: '#f44336',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                title="Delete comment"
              >
                Delete
              </button>
            )}
          </div>
        ))}
    </div>
  )
}

export default Comments
