import React from 'react'

const shareBtnStyle = {
  width: '100%',
  background: 'none',
  border: 'none',
  padding: '12px 18px',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background 0.15s',
  outline: 'none',
  borderBottom: '1px solid #f1f5f9',
}

const ShareMenu = ({ postId, onShare, onClose }) => {
  const postUrl = `${window.location.origin}/post/${postId}`
  const handleShare = (type) => {
    onShare(type, postUrl)
    onClose()
  }
  return (
    <ul
      className="share-menu"
      style={{
        position: 'absolute',
        top: 36,
        right: 0,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        zIndex: 20,
        minWidth: 220,
        padding: 0,
        margin: 0,
        listStyle: 'none',
        overflow: 'hidden',
        animation: 'fadeIn 0.18s',
      }}
    >
      <li>
        <button
          className="share-link-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('copy')}
        >
          🔗 Copy Link
        </button>
      </li>
      <li>
        <button
          className="share-linkedin-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('linkedin')}
        >
          in LinkedIn
        </button>
      </li>
      <li>
        <button
          className="share-telegram-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('telegram')}
        >
          ✈️ Telegram
        </button>
      </li>
      <li>
        <button
          className="share-whatsapp-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('whatsapp')}
        >
          🟢 WhatsApp
        </button>
      </li>
      <li>
        <button
          className="share-x-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('x')}
        >
          𝕏 Twitter/X
        </button>
      </li>
      <li>
        <button
          className="share-facebook-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('facebook')}
        >
          f Facebook
        </button>
      </li>
      <li>
        <button
          className="share-reddit-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('reddit')}
        >
          👽 Reddit
        </button>
      </li>
      <li>
        <button
          className="share-email-btn"
          style={shareBtnStyle}
          onClick={() => handleShare('email')}
        >
          ✉️ Email
        </button>
      </li>
    </ul>
  )
}

export default ShareMenu
