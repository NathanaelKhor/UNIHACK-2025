import React, { useState, useEffect } from "react";
import { Button } from "../ui/button/button";
import { Card, CardContent } from "../ui/card/card";
import "./gooddeed.css";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const GoodDeed = () => {
  const [kindness, setKindness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // This code tries to get the kindness from backend api
  const fetchKindness = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/kindness");
      if (!response.ok) {
        throw new Error("Failed to fetch kindness act");
      }
      const data = await response.json();
      setKindness(data.act);
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
    fetchKindness();
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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete good deed");
      }

      const data = await response.json();
      console.log("Good deed completed, new streak:", data.streak);
      setUser({ ...user, streak: data.streak });
    } catch (error) {
      console.error("Error completing good deed:", error);
    }
  };

  return (
    <div className="container">
      <Card className="card">
        <CardContent className="card-content">
          <h2 className="title">Random Act of Kindness</h2>
          <p>Current Streak: {user?.streak || 0}</p>
          {loading ? (
            <p className="message">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p className="message">{kindness}</p>
          )}
          <Button onClick={fetchKindness} className="button">
            Generate Act of Kindness
          </Button>
          <Button onClick={completeGoodDeed} className="button">
            Task Complete
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodDeed;
