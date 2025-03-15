import React, { useState } from "react";
import "./login.css"; // Ensure the file exists in the same directory

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    // Simple validation
    if (username === "" || password === "") {
      alert("Please fill in both username and password.");
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
            // Redirect to a new page or perform other actions
            // window.location.href = 'dashboard.html'; // Uncomment to redirect to another page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the user.');
    });
});
