import React, { useState } from "react";
import "./register.css"; // Ensure the file exists in the same directory
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
   const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    // Simple validation
    if (username.trim() === "") {
      alert("Please fill in a username.");
      return;
    }

    // Create user by calling the backend API
    fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error creating user: ' + data.error);
        } else {
            alert('User created successfully!');
            navigate('/login');
            // Redirect to a new page or perform other actions
            // window.location.href = 'dashboard.html'; // Uncomment to redirect to another page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the user.');
    });
  }

  return (
    <div className="login-container">
      <div className="login-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>
      <a href="login">Log-in Instead</a>
      </div>
    </div>
  );
};

export default Register;
