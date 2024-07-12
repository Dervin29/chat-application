import React, { useState } from "react";
import "./login.css";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './../../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const fetchUserInfo = useUserStore(state => state.fetchUserInfo);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        ...avatar,
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserInfo(response.user.uid);
      toast.success("Login Successful");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", response.user.uid), {
        username: username,
        email: email,
        id: response.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "usersChats", response.user.uid), {
        chats: [],
      });

      await fetchUserInfo(response.user.uid);
      toast.success("Registration Successful");
    } catch (error) {
      console.log(error);
      toast.error("Registration Failed: " + error.message);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button>Login</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>
          <input
            type="file"
            placeholder=""
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="username" name="username" />
          <input type="text" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
