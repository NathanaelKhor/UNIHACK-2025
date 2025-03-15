import React from "react";
import "./card.css";

const Card = ({ children, className = "" }) => {
  return <div className={`custom-card ${className}`}>{children}</div>;
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`custom-card-content ${className}`}>{children}</div>;
};

export { Card, CardContent };
