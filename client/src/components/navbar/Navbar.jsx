import './navbar.scss'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { DarkModeContext } from '../../context/DarkModeContext'
import { AuthContext } from '../../context/AuthContext.jsx'

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext)
  const { currentUser } = useContext(AuthContext)

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span>
            <img src="/headersimple.png" alt="headerLogo" />
          </span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <LightModeOutlinedIcon onClick={toggle} />
        ) : (
          <BedtimeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="search" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlineOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img src={currentUser.profilePic || '/Avater.png'} alt="User" />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
