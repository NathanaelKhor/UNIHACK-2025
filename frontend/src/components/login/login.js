import React, { useState } from "react";
import "./login.css"; // Ensure the file exists in the same directory
import { redirect } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    // Basic validation (you can expand this)
    if (!username || !password) {
      alert("Please fill in both username and password.");
      return;
    }

    try {
      // Make a POST request to your backend to check the user
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        //alert(data.message);
        // Redirect to the dashboard or other page
        // window.location.href = "/dashboard";
        window.location.href = "/gooddeed";
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
      </div>
    </div>
  );
};

export default Login;
