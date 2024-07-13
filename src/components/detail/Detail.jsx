import React from "react";
import "./Detail.css";
import {auth} from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, updateDoc } from "firebase/firestore";

const Detail = () => {

  const {chatId, user,  isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const {currentUser} = useUserStore();
  const handleBlock = async() => {
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id);
    try{
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();

    }catch(err){  
      console.log(err);
    }

  }
  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="avatar" />
        <h2>{user?.username }</h2>
        <p> lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="phone" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy</span>
            <img src="./arrowUp.png" alt="phone" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowUp.png" alt="phone" />
          </div>

          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="pexels-eugenia-remark-5767088-15283255.jpg" alt="photo" />
                <span>photo_2024_2.jpg</span>
              </div>
                <img src="./download.png" alt="download" className="icons" />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="phone" />
          </div>
        </div>

        <button className="block" onClick={handleBlock}>{isCurrentUserBlocked ? "you are blocked" :isReceiverBlocked ? " User is blocked" : "Block User" }</button>
        <button className="logOut" onClick={() => auth.signOut()}>LogOut</button>
      </div>
    </div>
  );
};

export default Detail;
