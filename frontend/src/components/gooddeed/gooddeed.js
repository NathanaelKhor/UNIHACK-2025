import React, { useState, useEffect } from "react";
import { Button } from "../ui/button/button";
import { Card, CardContent } from "../ui/card/card";
import "./gooddeed.css";

const GoodDeed = () => {
  const [kindness, setKindness] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKindness = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://your-backend-api.com/kindness");
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
    fetchKindness();
  }, []);

  return (
    <div className="container">
      <Card className="card">
        <CardContent className="card-content">
          <h2 className="title">Random Act of Kindness</h2>
          {loading ? (
            <p className="message">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <p className="message">{kindness}</p>
          )}
          <Button onClick={fetchKindness} className="button">Generate</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodDeed;
