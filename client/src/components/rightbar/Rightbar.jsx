import './rightbar.scss'
import { AuthContext } from '../../context/AuthContext.jsx'

const Rightbar = () => {
  return (
    <div className="rightbar">
      <div className="conitnear">
        <div className="item">
          <span>Suggestions For Your</span>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <span>John Doe</span>
            </div>
            <div className="button">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <span>John Doe</span>
            </div>
            <div className="button">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
        </div>
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <p>
                <span>John Doe</span>
                changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <p>
                <span>John Doe</span>
                changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <div className="online" />
              <span>John Doe</span>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <div className="online" />
              <span>John Doe</span>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img src="/register.jpg" alt="" />
              <div className="online" />
              <span>John Doe</span>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rightbar
