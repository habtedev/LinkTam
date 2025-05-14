import './leftbar.scss'
import Friends from '../../assets/1.png'
import Groups from '../../assets/2.png'
import Watch from '../../assets/4.png'
import Events from '../../assets/6.png'
import Gallery from '../../assets/8.png'
import Video from '../../assets/9.png'
import Messsage from '../../assets/10.png'
import BookmarksTwoToneIcon from '@mui/icons-material/BookmarksTwoTone'
import SettingsIcon from '@mui/icons-material/Settings'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useContext } from 'react'

const Leftbar = () => {
  const { currentUser } = useContext(AuthContext)
  return (
    <div className="leftBar">
      <div className="continear">
        <div className="menu">
          <div className="user">
            <img src={currentUser.profilePic} alt="User" />
            <span>{currentUser.name}</span>
          </div>
          <div className="item">
            <img src={Friends} alt="Friends" />
            <span>Friends</span>
          </div>
          <div className="item">
            <img src={Groups} alt="Groups" />
            <span>Groups</span>
          </div>
          <div className="item">
            <img src={Watch} alt="Watch" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Events} alt="Events" />
            <span>Events</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="Gallery" />
            <span>Gallery</span>
          </div>
          <div className="item">
            <img src={Video} alt="Video" />
            <span>Video</span>
          </div>
          <div className="item">
            <img src={Messsage} alt="Messages" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Your Shortcuts</span>
          <div className="item">
            <span>
              <BookmarksTwoToneIcon />
            </span>
            <span>Bookmark</span>
          </div>
          <div className="item">
            <SettingsIcon />
            <span>Settings</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leftbar
