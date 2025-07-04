import './share.scss'
import ImageIcon from '../../assets/img.png'
import MapIcon from '../../assets/map.png'
import FriendIcon from '../../assets/friend.png'
import { useContext, useState, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from '../../axios'
import { useSnackbar } from 'notistack'

const Share = () => {
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const formData = new FormData()
      formData.append('desc', newPost.desc)
      if (newPost.file) formData.append('file', newPost.file)

      return makeRequest.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setDesc('')
      setFile(null)
      setError('')
      setLoading(false)
      enqueueSnackbar('Your post was shared!', { variant: 'success' })
    },
    onError: (err) => {
      setLoading(false)
      setError('Failed to share your post. Please try again.')
      enqueueSnackbar('Failed to share your post. Please try again.', {
        variant: 'error',
      })
      console.error(err)
    },
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setError('File size should not exceed 2MB')
      return
    }
    setFile(selectedFile)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!desc && !file) {
      setError('Please add a description or a file.')
      return
    }
    setLoading(true)
    mutation.mutate({ desc, file })
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic || '/Avater.png'} alt="" />
          <input
            type="text"
            value={desc}
            placeholder={`What's on your mind, ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        {/* Preview selected image */}
        {file && (
          <div
            className="preview-image-wrapper"
            style={{ margin: '18px 0', textAlign: 'center' }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="preview-image"
              style={{
                maxWidth: '260px',
                maxHeight: '180px',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                border: '2px solid #5271ff',
                margin: '0 auto',
                display: 'block',
                objectFit: 'cover',
                transition: 'transform 0.2s cubic-bezier(.4,2,.6,1)',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = 'scale(1.03)')
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <button
              type="button"
              style={{
                display: 'block',
                margin: '10px auto 0',
                background: '#f5f5f7',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 18px',
                cursor: 'pointer',
                fontWeight: 500,
                color: '#333',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
        )}
        <hr />
        {error && <p className="error">{error}</p>}
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label onClick={() => fileInputRef.current.click()}>
              <div className="item">
                <img src={ImageIcon} alt="Add Image" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={MapIcon} alt="Add Place" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={FriendIcon} alt="Tag Friends" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button
              onClick={handleSubmit}
              disabled={loading || (!desc && !file)}
              className="modern-share-btn"
              style={{
                background: 'linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                padding: '10px 32px',
                fontWeight: 700,
                fontSize: '1.1rem',
                boxShadow: '0 2px 12px rgba(79,140,255,0.13)',
                cursor: loading || (!desc && !file) ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
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
                  Sharing...
                </>
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
        </div>
      </div>
    </div>
  )
}

export default Share
