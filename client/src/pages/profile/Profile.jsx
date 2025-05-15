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
import { useSnackbar } from 'notistack'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const Profile = () => {
  const { id } = useParams()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [profilePic, setProfilePic] = useState(currentUser?.profilePic || '')
  const [coverPic, setCoverPic] = useState(currentUser?.coverPic || '')
  const [name, setName] = useState(currentUser?.name || '')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followCounts, setFollowCounts] = useState({
    followers: 0,
    following: 0,
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [newName, setNewName] = useState(name)
  const profileInputRef = useRef()
  const backgroundInputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()

  // Fetch user info from database on mount or when id changes
  useEffect(() => {
    if (!id) return
    makeRequest.get(`/users/${id}`).then((res) => {
      setProfilePic(res.data.profilePic)
      setCoverPic(res.data.coverPic)
      setName(res.data.name)
    })
  }, [id])

  // Fetch follow state and counts
  useEffect(() => {
    if (!id || !currentUser) return
    if (String(currentUser.id) === String(id)) return // Don't fetch for self
    makeRequest
      .get(`/follows/state/${id}`)
      .then((res) => setIsFollowing(res.data.isFollowing))
      .catch(() => setIsFollowing(false))
  }, [id, currentUser])

  useEffect(() => {
    if (!id) return
    makeRequest
      .get(`/follows/counts/${id}`)
      .then((res) => setFollowCounts(res.data))
      .catch(() => setFollowCounts({ followers: 0, following: 0 }))
  }, [id, isFollowing])

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

  const handleFollow = async () => {
    if (String(currentUser.id) === String(id)) {
      enqueueSnackbar("You can't follow yourself!", { variant: 'warning' })
      return
    }
    try {
      await makeRequest.post(`/follows/${id}`)
      setIsFollowing(true)
      enqueueSnackbar('Followed successfully!', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to follow user.', { variant: 'error' })
    }
  }

  const handleUnfollow = async () => {
    try {
      await makeRequest.delete(`/follows/${id}`)
      setIsFollowing(false)
      enqueueSnackbar('Unfollowed successfully!', { variant: 'info' })
    } catch {
      enqueueSnackbar('Failed to unfollow user.', { variant: 'error' })
    }
  }

  const isOwnProfile = String(currentUser.id) === String(id)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleEditNameOpen = () => {
    setEditNameOpen(true)
    setAnchorEl(null)
  }
  const handleEditNameClose = () => {
    setEditNameOpen(false)
    setNewName(name)
  }
  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handleNameUpdate = async () => {
    try {
      await makeRequest.put(`/users/${id}`, { name: newName })
      setName(newName)
      if (isOwnProfile) {
        setCurrentUser({ ...currentUser, name: newName })
        localStorage.setItem(
          'user',
          JSON.stringify({ ...currentUser, name: newName }),
        )
      }
      enqueueSnackbar('Name updated!', { variant: 'success' })
      setEditNameOpen(false)
    } catch {
      enqueueSnackbar('Failed to update name.', { variant: 'error' })
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
              <div className="item">
                <b>{followCounts.followers}</b> Followers
              </div>
              <div className="item">
                <b>{followCounts.following}</b> Following
              </div>
            </div>
            {String(currentUser.id) !== String(id) &&
              (isFollowing ? (
                <button className="follow-btn" onClick={handleUnfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="follow-btn" onClick={handleFollow}>
                  Follow
                </button>
              ))}
          </div>
          <div className="right">
            <span>
              <EmailOutlinedIcon />
            </span>
            {isOwnProfile && (
              <span onClick={handleMenuOpen} style={{ cursor: 'pointer' }}>
                <MoreVertIcon />
              </span>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEditNameOpen}>Update Name</MenuItem>
              {/* Add more options here if needed */}
            </Menu>
            {/* Name Edit Dialog */}
            {editNameOpen && (
              <div className="edit-name-modal">
                <div className="modal-content">
                  <h3>Update Name</h3>
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    className="edit-name-input"
                  />
                  <div className="modal-actions">
                    <button onClick={handleNameUpdate} className="save-btn">
                      Save
                    </button>
                    <button
                      onClick={handleEditNameClose}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Posts />
      </div>
    </div>
  )
}

export default Profile
