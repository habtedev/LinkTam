import React from 'react'

const EditForm = ({
  editDesc,
  setEditDesc,
  post,
  editFile,
  setEditFile,
  fileInputRef,
  handleEditSave,
  handleEditCancel,
  updateLoading,
}) => (
  <>
    <textarea
      value={editDesc}
      onChange={(e) => setEditDesc(e.target.value)}
      style={{
        width: '100%',
        minHeight: 60,
        marginBottom: 10,
        borderRadius: 8,
        padding: 8,
        border: '1px solid #ccc',
      }}
    />
    {post.img && !editFile && (
      <div style={{ marginBottom: 10 }}>
        <img
          src={post.img}
          alt="post"
          style={{ maxWidth: 180, borderRadius: 8 }}
        />
        <button
          onClick={() => setEditFile('REMOVE')}
          style={{
            marginLeft: 10,
            color: '#f44336',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Remove Image
        </button>
      </div>
    )}
    {editFile && editFile !== 'REMOVE' && (
      <div style={{ marginBottom: 10 }}>
        <img
          src={URL.createObjectURL(editFile)}
          alt="preview"
          style={{ maxWidth: 180, borderRadius: 8 }}
        />
        <button
          onClick={() => setEditFile(null)}
          style={{
            marginLeft: 10,
            color: '#f44336',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      </div>
    )}
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={(e) => setEditFile(e.target.files[0])}
    />
    <button
      onClick={() => fileInputRef.current.click()}
      style={{
        marginRight: 10,
        background: '#f3f4f6',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        padding: '6px 18px',
        fontWeight: 500,
        fontSize: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'background 0.15s, color 0.15s, border 0.15s',
        cursor: 'pointer',
        outline: 'none',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#e0e7ef'
        e.currentTarget.style.color = '#2563eb'
        e.currentTarget.style.border = '1px solid #2563eb'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = '#f3f4f6'
        e.currentTarget.style.color = '#374151'
        e.currentTarget.style.border = '1px solid #d1d5db'
      }}
    >
      <span role="img" aria-label="change">
        🖼️
      </span>{' '}
      Change Image
    </button>
    <button
      onClick={handleEditSave}
      style={{
        background: '#4f8cff',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '6px 18px',
        marginRight: 8,
      }}
      disabled={updateLoading}
    >
      {updateLoading ? 'Saving...' : 'Save'}
    </button>
    <button
      onClick={handleEditCancel}
      style={{
        background: '#eee',
        border: 'none',
        borderRadius: 6,
        padding: '6px 18px',
      }}
      disabled={updateLoading}
    >
      Cancel
    </button>
  </>
)

export default EditForm
