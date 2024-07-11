import React from 'react'
import './chatlist.css'

const ChatList = () => {
  const [addMode, setAddMode] = React.useState(false)
  return (
    <div className='chatlist'>
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='search'/>
          <input type='text' placeholder='Search'/>
        </div>

        <img src={addMode ? './minus.png' : './plus.png'} alt='plus' className='add' onClick={() => setAddMode(!addMode)}/>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='avatar'/>
        <div className='texts'>
          <span>alan</span>
          <p>Hello</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='avatar'/>
        <div className='texts'>
          <span>alan</span>
          <p>Hello</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='avatar'/>
        <div className='texts'>
          <span>alan</span>
          <p>Hello</p>
        </div>
      </div>
      
    </div>
  )
}

export default ChatList