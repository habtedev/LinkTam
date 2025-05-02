import './navbar.scss'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import { Link } from '@mui/material'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span>
            <img src="/headersimple.png" alt="headerLogo" />
            
          </span>
        </Link>
        <HomeOutlinedIcon />
        <BedtimeOutlinedIcon />
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
          <img src="/register.jpg" alt="" />
          <span>john Doe</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
