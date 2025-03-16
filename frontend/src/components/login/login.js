import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Ensure the file exists in the same directory
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          username: data.username,
          password: data.password,
          streak: data.streak || 0,
          friends: data.friends || [],
        };
        setUser(userData);
        navigate("/gooddeed");
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
        <a href="register">Register Instead</a>
      </div>
    </div>
  );
};

export default Login;
