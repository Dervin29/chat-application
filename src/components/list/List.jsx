import React from 'react'
import './List.css';
import ChatList from '../chat_list/ChatList.jsx'
import UserInfo from '../user_info/UserInfo.jsx'

const List = () => {
  return (
    <div className='list'>
      <UserInfo/>
      <ChatList/>
    </div>
  )
}

export default List