import React from 'react';
import './chatlist.css';
import AddUser from '../addUser/AddUser';
import { useUserStore } from '../../lib/userStore';
import { useChatStore } from '../../lib/chatStore';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ChatList = () => {
  const [addMode, setAddMode] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [chats, setChats] = React.useState([]);
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  const refreshChatList = React.useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const userChatRef = doc(db, "userChats", currentUser.id);
      const userChatSnap = await getDoc(userChatRef);

      if (userChatSnap.exists()) {
        const items = userChatSnap.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.exists() ? userDocSnap.data() : {};
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
    }
  }, [currentUser?.id]);

  const handleSelect = async(chat) => {
    const userChats = chats.map((item) => {
      const {user, ...rest} = item;
      return rest;
    })
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userChats", currentUser.id);
    try{
      await updateDoc(userChatRef, {
        chats: userChats
      });
      changeChat(chat.chatId, chat.user);
    }
    catch(error){
      console.log(error);
    }

  }

  const filteredChats = chats.filter((chat) => {
    return chat.user.username.toLowerCase().includes(search.toLowerCase());
  });

  React.useEffect(() => {
    refreshChatList();
  }, [refreshChatList]);

  const handleUserAdded = React.useCallback(() => {
    refreshChatList();
  }, [refreshChatList]);




  return (
    <div className='chatlist'>
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='search' />
          <input type='text' placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt='plus'
          className='add'
          onClick={() => setAddMode(!addMode)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div className='item' key={chat.id} onClick={()=>handleSelect(chat)} style={{
          backgroundColor: chat?.isSeen ? "transparent" : "#eee",
        }}>
          <img src={chat.user.blocked ? './avatar.png' : chat.user.avatar} alt='avatar' />
          <div className='texts'>
            <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser onUserAdded={handleUserAdded} />}
    </div>
  );
};

export default ChatList;
