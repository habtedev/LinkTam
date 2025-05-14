import './post.scss'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Link } from 'react-router-dom'
import Comments from '../comments/Comments'
import { useState } from 'react'

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false)

  //TEMPORARY
  const liked = false

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
              <span className="date">1 min ago</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {/* Always show the image if post.img is a non-empty string */}
          {typeof post.img === 'string' && post.img.trim() !== '' ? (
            <img
              src={post.img}
              alt="post"
              onError={(e) => {
                e.target.onerror = null
                e.target.src =
                  'https://res.cloudinary.com/di3ll9dgt/image/upload/v1747205657/user_uploads/6/rj5vmpiudjwetluuggkq.png'
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                borderRadius: '10px',
                marginTop: '20px',
              }}
            />
          ) : null}
        </div>
        <div className="info">
          <div className="item">
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            12 Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments />}
      </div>
    </div>
  )
}

export default Post
