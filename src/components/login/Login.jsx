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
  const [isRegistering, setIsRegistering] = useState(false);
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

    if (!validateForm(formData)) {
      return;
    }

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

  const validateForm = (formData) => {
    let valid = true;

    if (isRegistering) {
      if (!formData.get('username').trim()) {
        valid = false;
        toast.error("Username is required");
      }
    }

    if (!formData.get('email').trim()) {
      valid = false;
      toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.get('email'))) {
      valid = false;
      toast.error("Email is invalid");
    }

    if (!formData.get('password').trim()) {
      valid = false;
      toast.error("Password is required");
    } else if (formData.get('password').length < 6) {
      valid = false;
      toast.error("Password must be at least 6 characters");
    }

    return valid;
  };

  const toggleForm = () => {
    setIsRegistering((prevState) => !prevState);
  };

  return (
    <div className="login">
      <div className="item">
        <h2>{isRegistering ? "Create an Account" : "Welcome Back"}</h2>
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <>
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
            </>
          )}
          <input type="text" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button>{isRegistering ? "Sign Up" : "Login"}</button>
        </form>
        <p onClick={toggleForm}>
          {isRegistering ? (
            <p>Already have an account? <span style={{ cursor: "pointer", color: "white", textDecoration: "underline" }}>Login here.</span></p>
          ) : (
            <p>Don't have an account? <span style={{ cursor: "pointer", color: "white", textDecoration: "underline" }}>Register here.</span></p>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
