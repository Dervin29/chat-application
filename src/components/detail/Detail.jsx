import React from "react";
import "./Detail.css";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src="./avatar.png" alt="avatar" />
        <h2>Alan</h2>
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

        <button className="block">Block User</button>
        <button className="logOut">LogOut</button>
      </div>
    </div>
  );
};

export default Detail;
