import React, { Children } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/register/Register'
import Navbar from './components/navbar/Navbar'
import Leftbar from './components/leftbar/Leftbar'
import Rightbar from './components/rightbar/Rightbar'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile' // Assuming this component exists



function App() {

  const currentUser= false;
function Layout() {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Leftbar />
        <Outlet />
        <Rightbar />
      </div>
    </div>
  )
}
const ProtectedRoute = ({Children}) =>{
  if(!currentUser){
    return <Navigate to= '/login'/>
  }
  return Children
}

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
