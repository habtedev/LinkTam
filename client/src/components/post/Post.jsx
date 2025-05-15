import React, { useState, useRef, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import Comments from '../comments/Comments'
import Likes from '../likes/Likes'
import { AuthContext } from '../../context/AuthContext'
import { useSnackbar } from 'notistack'
import { makeRequest } from '../../axios'
import ShareMenu from './ShareMenu'
import EditForm from './EditForm'
import './post.scss'

dayjs.extend(relativeTime)

const Post = ({ post, onDelete, onUpdate }) => {
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editDesc, setEditDesc] = useState(post.desc)
  const [editFile, setEditFile] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const fileInputRef = useRef()
  const open = Boolean(anchorEl)
  const { currentUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleDelete = () => {
    handleMenuClose()
    if (currentUser.id !== post.userId) {
      enqueueSnackbar('You can only delete your own posts.', {
        variant: 'warning',
      })
      return
    }
    if (onDelete) onDelete(post.id, post.img)
  }
  const handleEdit = () => {
    setEditMode(true)
    handleMenuClose()
  }
  const handleEditCancel = () => {
    setEditMode(false)
    setEditDesc(post.desc)
    setEditFile(null)
  }
  const handleEditSave = async () => {
    if (currentUser.id !== post.userId) {
      enqueueSnackbar('You can only update your own posts.', {
        variant: 'warning',
      })
      return
    }
    if (onUpdate) {
      setUpdateLoading(true)
      try {
        await onUpdate(post.id, editDesc, editFile, post.img)
        setEditMode(false)
      } catch {
        enqueueSnackbar('Failed to update post.', { variant: 'error' })
      } finally {
        setUpdateLoading(false)
      }
    }
  }

  const handleShare = (type, postUrl) => {
    setShowShareMenu(false)
    if (type === 'copy') {
      navigator.clipboard.writeText(postUrl)
      enqueueSnackbar('Link copied to clipboard!', { variant: 'success' })
    } else if (type === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          postUrl,
        )}`,
        '_blank',
      )
    } else if (type === 'telegram') {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(postUrl)}`,
        '_blank',
      )
    } else if (type === 'whatsapp') {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(postUrl)}`,
        '_blank',
      )
    } else if (type === 'x') {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
        '_blank',
      )
    } else if (type === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl,
        )}`,
        '_blank',
      )
    } else if (type === 'reddit') {
      window.open(
        `https://www.reddit.com/submit?url=${encodeURIComponent(postUrl)}`,
        '_blank',
      )
    } else if (type === 'email') {
      window.open(
        `mailto:?subject=Check%20out%20this%20post&body=${encodeURIComponent(
          postUrl,
        )}`,
      )
    }
  }

  const isOwnPost = currentUser && post.userId === currentUser.id

  // Fetch bookmark state for this post
  useEffect(() => {
    if (!currentUser) return
    makeRequest.get('/bookmarks').then((res) => {
      setBookmarked(res.data.includes(post.id))
    })
  }, [post.id, currentUser])

  const handleBookmark = async () => {
    if (isOwnPost) {
      enqueueSnackbar("You can't bookmark your own post.", {
        variant: 'warning',
      })
      return
    }
    if (bookmarked) {
      await makeRequest.delete(`/bookmarks/${post.id}`)
      setBookmarked(false)
      enqueueSnackbar('Removed from bookmarks', { variant: 'info' })
    } else {
      await makeRequest.post('/bookmarks', { postId: post.id })
      setBookmarked(true)
      enqueueSnackbar('Saved to bookmarks', { variant: 'success' })
    }
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{dayjs(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon
            style={{ cursor: 'pointer' }}
            onClick={handleMenuClick}
          />
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>Update Post</MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
              Delete Post
            </MenuItem>
          </Menu>
        </div>
        <div className="content">
          {editMode ? (
            <EditForm
              editDesc={editDesc}
              setEditDesc={setEditDesc}
              post={post}
              editFile={editFile}
              setEditFile={setEditFile}
              fileInputRef={fileInputRef}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
              updateLoading={updateLoading}
            />
          ) : (
            <>
              <p>{post.desc}</p>
              <div
                className="post-image-wrapper"
                onDoubleClick={() => {
                  if (post.hasLiked) {
                    if (post.id) makeRequest.delete(`/likes/${post.id}`)
                  } else {
                    if (post.id) makeRequest.post('/likes', { postId: post.id })
                  }
                }}
              >
                {post.img && (
                  <img src={post.img} alt="post" className="post-img" />
                )}
              </div>
            </>
          )}
        </div>
        <div className="info">
          <div className="item">
            <Likes postId={post.id} />
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentCount} Comments
          </div>
          <div className="item" style={{ position: 'relative' }}>
            <ShareOutlinedIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setShowShareMenu((prev) => !prev)}
              tabIndex={0}
              title="Share post"
              aria-label="Share post"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ')
                  setShowShareMenu((prev) => !prev)
              }}
            />
            {showShareMenu && (
              <ShareMenu
                postId={post.id}
                onShare={handleShare}
                onClose={() => setShowShareMenu(false)}
              />
            )}
          </div>
          {/* Bookmark icon only for posts not owned by the current user */}
          {!isOwnPost && (
            <span
              className="bookmark-btn"
              onClick={handleBookmark}
              title={bookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
              style={{ marginLeft: 'auto', cursor: 'pointer' }}
            >
              {bookmarked ? (
                <BookmarkIcon style={{ color: '#5271ff' }} />
              ) : (
                <BookmarkBorderIcon style={{ color: '#aaa' }} />
              )}
            </span>
          )}
        </div>
        {commentOpen && post.id && (
          <Comments postId={post.id} setCommentCount={setCommentCount} />
        )}
      </div>
    </div>
  )
}

export default Post
