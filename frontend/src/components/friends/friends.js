import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./friends.css";
import { useUser } from "../../context/UserContext";

const Friends = () => {
  const [friendUsername, setFriendUsername] = useState("");
  const [friendList, setFriendList] = useState([]);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Sort friends by streak in descending order
      const sortedFriends = [
        ...(Array.isArray(user.friends) ? user.friends : []),
      ].sort((a, b) => (b.streak || 0) - (a.streak || 0));
      setFriendList(sortedFriends);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!friendUsername.trim()) {
      alert("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          friendUsername: friendUsername.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add friend");
      }

      setUser({
        ...user,
        friends: data.userFriends || [],
      });

      setFriendUsername("");
      alert("Friend added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="friends-container">
      <div className="friends-box">
        <div className="friends-content">
          <div className="friends-list">
            <h3 className="header">Your Friends</h3>
            {friendList.length > 0 ? (
              <ul>
                {friendList.map((friend, index) => (
                  <li key={index}>
                    <div className="friend-info">
                      <span>{friend.username}</span>
                    </div>
                    <div className="streak-badge">
                      <span className="streak-icon">🔥</span>
                      <span className="streak-count text">
                        {friend.streak} days
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text">No friends added yet</p>
            )}
          </div>

          <div className="add-friend-section">
            <h2 className="header add-friend-title">Add Friend</h2>
            <form onSubmit={handleSubmit}>
              <input
                className="friend-input"
                type="text"
                id="friendUsername"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                placeholder="Enter friend's username"
              />
              <button className="add-friend-button" type="submit">
                Add Friend
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
