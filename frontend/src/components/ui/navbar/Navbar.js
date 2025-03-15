import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Butter Butter</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Log In</Link></li>
        <li><Link to="/gooddeed">Spread the kindness</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;