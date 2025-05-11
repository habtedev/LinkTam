import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null,
  )

  const login = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8600/api/auth/login', formData, {
        withCredentials: true,
      })
      setCurrentUser(response.data)
      return response.data
    } catch (error) {
      // Handle backend error responses for user not found or password mismatch
      if (error.response && error.response.data) {
        if (error.response.data.error === 'User not found!') {
          return { userNotFound: true }
        }
        if (error.response.data.error === 'Invalid password' || error.response.data.error === 'Invalid username or password') {
          return { passwordMismatch: true }
        }
        // Return any other backend error
        return { error: error.response.data.error || error.response.data.message }
      }
      // For network or unexpected errors, throw so the frontend can catch
      throw error
    }
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  )
}
