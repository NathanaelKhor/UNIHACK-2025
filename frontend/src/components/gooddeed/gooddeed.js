import React, { useState, useEffect } from "react";
import { Button } from "../ui/button/button";
import { Card, CardContent } from "../ui/card/card";
import "./gooddeed.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import streak from "../assets/streak.png";

const GoodDeed = () => {
  const [kindness, setKindness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promptGenerated, setpromptGenerated] = useState(false);
  const [deedCompleted, setDeedCompleted] = useState(false); // To track if the deed is completed
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // This code tries to get the kindness from backend API
  const fetchKindness = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }
    setLoading(true);
    setError(null);
    console.log(
      "Generating good deed request for user:",
      user.username
    );
    try {
      console.log("we will now try to connect to the backend");
      const response = await fetch(
        "http://localhost:5001/api/kindness",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
            promptGenerated: user.promptGenerated

          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch kindness act");
      }
      const data = await response.json();
      setKindness(data.act);
      setpromptGenerated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // fetchKindness();
  }, [user, navigate]);

  const completeGoodDeed = async () => {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    try {
      console.log(
        "Sending complete good deed request for user:",
        user.username
      );
      const response = await fetch(
        "http://localhost:5001/api/completeGoodDeed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
            streak: user.streak || 0,
            dailyDone: user.dailyDone
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete good deed");
      }

      const data = await response.json();
      console.log("Good deed completed, new streak:", data.streak);
      setUser({ ...user, streak: data.streak });
      setDeedCompleted(true); // Mark deed as completed
    } catch (error) {
      console.error("Error completing good deed:", error);
    }
  };

  return (
    
    <div className="container">
      <Card className="card">
        <CardContent className="card-content">
          <h2 className="title">Random Act of Kindness</h2>
          <div className="streak">
            <a href="/">
              <img src={streak} alt="Streak" />
            </a>
          </div>
          <p>Current Streak: {user?.streak || 0}</p>
          {loading ? (
            <p className="message">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p className="message">{kindness}</p>
          )}
          {promptGenerated ? 
          (!deedCompleted ? 
          (
            <Button
              onClick={completeGoodDeed}
              className={`button ${deedCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={deedCompleted} // This disables the button after completion
            > 
              Mark as completed
            </Button>
          ) : (
            <p>Task Completed</p>
          ))
          : (
            <Button onClick={fetchKindness} className="button">
              Generate Act of Kindness
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodDeed;
