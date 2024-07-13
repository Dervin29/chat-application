import "./adduser.css";
import { db } from "../../lib/firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "../../lib/userStore";

const AddUser = ({ onUserAdded }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser({ id: querySnapShot.docs[0].id, ...querySnapShot.docs[0].data() });
        setError(null);
      } else {
        setUser(null);
        setError("User not found");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while searching");
    }
  };

  const createOrUpdateUserChat = async (userId, chatId, receiverId, updatedAt) => {
    const userChatRef = doc(db, "userChats", userId);
    const userChatDoc = await getDoc(userChatRef);

    const chatData = {
      chatId: chatId,
      lastMessage: "",
      receiverId: receiverId,
      updatedAt: updatedAt,
    };

    if (userChatDoc.exists()) {
      await updateDoc(userChatRef, {
        chats: arrayUnion(chatData),
      });
    } else {
      await setDoc(userChatRef, {
        chats: [chatData],
      });
    }

    onUserAdded(); // Notify parent component that user has been added
  };

  const handleAddUser = async () => {
    if (!user?.id || !currentUser?.id) {
      setError("User IDs are not properly set");
      return;
    }

    const chatRef = collection(db, "chats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const updatedAt = new Date(); // Or use Timestamp.now() if you're using Firebase v9 modular SDK

      await createOrUpdateUserChat(user.id, newChatRef.id, currentUser.id, updatedAt);
      await createOrUpdateUserChat(currentUser.id, newChatRef.id, user.id, updatedAt);
    } catch (err) {
      console.log(err);
      setError("An error occurred while adding the user");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {error && <div className="error">{error}</div>}
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
