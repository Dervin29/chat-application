import React, { useEffect } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";

const Chat = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [chat, setChat] = React.useState([]);
  const [img, setImg] = React.useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user , isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const ref = React.useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [text]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  console.log(chat);

  const handleEmojiClick = (e) => {
    setText((prevInput) => prevInput + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await uploadImage(img.file); // Assuming you have an uploadImage function
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          text,
          senderId: currentUser.id,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }), // Conditionally add img field if imgUrl exists
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chats.findIndex((chat) => chat.chatId === chatId);

          userChatData.chats[chatIndex].lastMessage = text;
          userChatData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatData.chats[chatIndex].updatedAt = new Date();

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setText("");
    setImg({ file: null, url: "" });
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span>
              {user?.username}
            </span>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="phone" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="info" />
        </div>
      </div>
      <div className="middle">
        {chat?.messages?.map((message, index) => (
          <div className={message?.senderId === currentUser?.id ? "message me" : "message"} key={message?.createdAt}>
            <div className="texts">
              {/* Display message content */}
              {message.img && <img src={message.img} alt="img" />}
              <p>{message.text}</p>
              <span>{new Date(message.createdAt?.seconds * 1000).toLocaleString()}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message me">
            <div className="texts">
              <img src={img.url} alt="img" />
            </div>
          </div>
        )}
        <div ref={ref}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="img" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImage} />
          <img src="./camera.png" alt="video" />
          <img src="./mic.png" alt="info" />
        </div>
        <input
          type="text"
          placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send message" : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="emoji" onClick={() => setOpen(!open)} />
          <div className="emoji-picker">
            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button className="send-btn" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
