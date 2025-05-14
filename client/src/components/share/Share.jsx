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
          <img src={currentUser.profilePic} alt="" />
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
            style={{ margin: '16px 0', textAlign: 'center' }}
          >
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="preview-image"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
            <button
              type="button"
              style={{
                display: 'block',
                margin: '8px auto 0',
                background: '#eee',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                cursor: 'pointer',
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
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Share
