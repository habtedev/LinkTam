import Post from "../post/Post"
import "./posts.scss"

const Posts = () => {
  
   
    //TEPORARY DATA 
     const posts = [
       {
         id: 1,
         name: 'John Doe',
         userId: 1,
         profilePic:
           'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600',
         desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit voluptate odit nesciunt, recusandae dolores soluta ratione, accusantium eum veritatibus.',
         img: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
       },
       {
         id: 2,
         name: 'Jane Smith',
         userId: 2,
         profilePic:
           'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
         img: 'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600',
       },
       {
         id: 3,
         name: 'John Doe',
         profilePic:
           'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
         img: 'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600',
       },
       {
         id: 4,
         name: 'Jane Smith',
         profilePic:
           'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600',
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
         img: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1600',
       },
     ]
  return (
     
    <div className="posts">
     { posts.map(post => (
      <Post post={post} key={post.id}/>
      
     ))}
    </div>
  )
}

export default Posts
