import './profile.scss'
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import PinterestIcon from '@mui/icons-material/Pinterest'
import TwitterIcon from '@mui/icons-material/Twitter'
import PlaceIcon from '@mui/icons-material/Place'
import LanguageIcon from '@mui/icons-material/Language'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Posts from '../../components/posts/Posts'
import { useContext, useRef, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { makeRequest } from '../../axios'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const { id } = useParams()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [profilePic, setProfilePic] = useState(currentUser?.profilePic || '')
  const [coverPic, setCoverPic] = useState(currentUser?.coverPic || '')
  const [name, setName] = useState(currentUser?.name || '')
  const profileInputRef = useRef()
  const backgroundInputRef = useRef()

  // Fetch user info from database on mount or when id changes
  useEffect(() => {
    if (!id) return
    makeRequest.get(`/users/${id}`).then((res) => {
      setProfilePic(res.data.profilePic)
      setCoverPic(res.data.coverPic)
      setName(res.data.name)
    })
  }, [id])

  const updateProfilePicInContext = (newUrl) => {
    if (typeof setCurrentUser === 'function') {
      const updatedUser = { ...currentUser, profilePic: newUrl }
      setCurrentUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('profilePic', file)
    try {
      const res = await makeRequest.post('/users/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfilePic(res.data.profilePic)
      updateProfilePicInContext(res.data.profilePic)
    } finally {
      // no-op
    }
  }

  const handleBackgroundPicChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('backgroundPic', file)
    try {
      const res = await makeRequest.post('/users/background-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setCoverPic(res.data.coverPic)
      // If this is the current user's profile, update context and localStorage for global sync
      if (currentUser && String(currentUser.id) === String(id)) {
        const updatedUser = {
          ...currentUser,
          coverPic: res.data.coverPic,
        }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } finally {
      // no-op
    }
  }

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            coverPic && coverPic.trim() !== ''
              ? coverPic
              : 'https://res.cloudinary.com/di3ll9dgt/image/upload/v1747204523/sample.jpg'
          }
          alt="cover"
          className="cover"
          onClick={() => backgroundInputRef.current.click()}
          style={{ cursor: 'pointer' }}
        />
        <input
          type="file"
          accept="image/*"
          ref={backgroundInputRef}
          style={{ display: 'none' }}
          onChange={handleBackgroundPicChange}
        />
        <img
          src={
            profilePic ||
            'https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load'
          }
          alt="profile"
          className="profilePic"
          onClick={() => profileInputRef.current.click()}
          style={{ cursor: 'pointer' }}
        />
        <input
          type="file"
          accept="image/*"
          ref={profileInputRef}
          style={{ display: 'none' }}
          onChange={handleProfilePicChange}
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>USA</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>LinkTam</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className="right">
            <span>
              <EmailOutlinedIcon />
            </span>
            <span>
              <MoreVertIcon />
            </span>
          </div>
        </div>
        <Posts />
      </div>
    </div>
  )
}

export default Profile
