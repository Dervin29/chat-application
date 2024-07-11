import React from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const handleEmojiClick = (e) => {
    setText((prevInput) => prevInput + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>Alan</span>
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

        <div className="message me">
          <div className="texts">
            <p> Lorem ipsum dolor sit amet.</p>
            <span>1min ago</span>
          </div>
        </div>

        <div className="message">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <p> Lorem ipsum dolor sit amet.</p>
            <span>1min ago</span>
          </div>
        </div>


        <div className="message me">
          
          <div className="texts">
            <p> Lorem ipsum dolor sit amet.</p>
            <span>1min ago</span>
          </div>
        </div>

        
        <div className="message">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <p> Lorem ipsum dolor sit amet.</p>
            <span>1min ago</span>
          </div>
        </div>

      </div>


      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="phone" />
          <img src="./camera.png" alt="video" />
          <img src="./mic.png" alt="info" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img src="./emoji.png" alt="emoji" onClick={() => setOpen(!open)} />
          <div className="emoji-picker">
            <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;
