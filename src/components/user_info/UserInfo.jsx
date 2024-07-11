import React from 'react'
import './userinfo.css'

const UserInfo = () => {
  return (
    <div className='userinfo'>
      <div className='user'>
        <img src='./avatar.png' alt='avatar'/>
        <h2>Alan</h2>
      </div>
      <div className='icons'>
        <img src='./more.png' alt='more'/>
        <img src='./video.png' alt='video'/>
        <img src='./edit.png' alt='edit'/>
      </div>
      
    </div>
  )
}

export default UserInfo