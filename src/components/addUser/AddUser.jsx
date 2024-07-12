import React, { useState } from 'react';
import './adduser.css';
import { doc, collection, query, where, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
        setError(null);
      } else {
        setUser(null);
        setError("User not found");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while searching");
    }
  };

  const handleAddUser = async () => {
    if (!user) return;

    const chatRef = collection(db, "chats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });
      console.log(newChatRef.id);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("An error occurred while adding the user to the chat");
    }
  };

  return (
    <div className='adduser'>
      <form onSubmit={handleSearch}>
        <input type='text' placeholder='username' name='username' />
        <button type='submit'>Search</button>
      </form>
      {error && <div className='error'>{error}</div>}
      {user && (
        <div className='user'>
          <div className='detail'>
            <img src={user?.avatar || './avatar.png'} alt='avatar' />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
