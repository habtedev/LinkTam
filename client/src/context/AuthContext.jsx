import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )

  const login = async (formData) => {
    try {
      const response = await axios.post(
        'http://localhost:8600/api/auth/login',
        formData,
        {
          withCredentials: true,
        },
      )
      setCurrentUser(response.data)
      return response.data
    } catch (error) {
      // Handle backend error responses for user not found or password mismatch
      if (error.response && error.response.data) {
        if (error.response.data.error === 'User not found!') {
          return { userNotFound: true }
        }
        if (
          error.response.data.error === 'Invalid password' ||
          error.response.data.error === 'Invalid username or password'
        ) {
          return { passwordMismatch: true }
        }
        // Return any other backend error
        return {
          error: error.response.data.error || error.response.data.message,
        }
      }
      // For network or unexpected errors, throw so the frontend can catch
      throw error
    }
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  // Only set default backgroundPic on first login or if user is missing it, not after upload
  useEffect(() => {
    if (
      currentUser &&
      (!('backgroundPic' in currentUser) ||
        currentUser.backgroundPic === '' ||
        currentUser.backgroundPic == null)
    ) {
      const updatedUser = {
        ...currentUser,
        backgroundPic:
          'https://res.cloudinary.com/di3ll9dgt/image/upload/v1747204523/sample.jpg',
      }
      setCurrentUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login }}>
      {children}
    </AuthContext.Provider>
  )
}
