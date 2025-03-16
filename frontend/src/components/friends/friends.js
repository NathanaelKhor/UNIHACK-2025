import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./friends.css"; // Ensure the file exists in the same directory
import { useUser } from "../../context/UserContext";

const Friends = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!friendUsername) {
      alert("Please fill in username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username, friendUsername }),
      });

      const data = await response.json();
      const userFriends = data.userFriends.map((friend) => friend.username);
      if (response.ok) {
        const userData = {
          username: data.username,
          password: data.password,
          streak: data.streak || 0,
          friends: userFriends
        };
        setUser(userData);
        navigate("/friends");
      } else {
        alert(data.error || "Add friend failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding friend.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Add Friend</h2>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            id="friendUsername"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
          />
          <button type="submit">Add Friend</button>
        </form>
      </div>
    </div>
  );
};

export default Friends;
