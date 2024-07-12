import React from 'react'
import './chatlist.css'
import AddUser from '../addUser/AddUser'
import { useUserStore } from '../../lib/userStore'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'


const ChatList = () => {
  const [addMode, setAddMode] = React.useState(false)
  const [chats, setChats] = React.useState([])

  const {currentUser} = useUserStore();

  React.useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "chats", item);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser?.id]);

  return (
    <div className='chatlist'>
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='search'/>
          <input type='text' placeholder='Search'/>
        </div>

        <img src={addMode ? './minus.png' : './plus.png'} alt='plus' className='add' onClick={() => setAddMode(!addMode)}/>
      </div>

      {chats.map((chat) => (
        <div className='item' key={chat.id}>
        <img src='./avatar.png' alt='avatar'/>
        <div className='texts'>
          <span>alan</span>
          <p>{chat.lastMessage}</p>
        </div>
      </div>
      ))}
      

      { addMode && <AddUser/>}
    </div>
  )
}

export default ChatList