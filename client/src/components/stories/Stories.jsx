import { useContext } from 'react'
import './stories.scss'
import { AuthContext } from '../../context/AuthContext.jsx'

const Stories = () => {
  const { currentUser } = useContext(AuthContext)

  const Stories = [
    {
      id: 1,
      name: 'John Doe',
      img: 'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    {
      id: 2,
      name: 'Jane Smith',
      img: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    {
      id: 3,
      name: 'John Doe',
      img: 'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    {
      id: 4,
      name: 'Jane Smith',
      img: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
  ]

  return (
    <div className="stories">
      {currentUser && (
        <div key={currentUser.id} className="story">
          <img src={currentUser.profilePic} alt={currentUser.name} />
          <span>{currentUser.name}</span>
          <button>+</button>
        </div>
      )}
      {Stories.map((story) => (
        <div key={story.id} className="story">
          <img src={story.img} alt={story.name} />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  )
}

export default Stories
