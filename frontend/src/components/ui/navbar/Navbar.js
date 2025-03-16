import React, { useState } from "react"; // Import React and useState for state management
import "./Navbar.css"; // Import external CSS for styling
import logo from "../../assets/linelogo.png"; // Import the logo image
import { useUser } from "../../../context/UserContext";
import {Link} from "react-router-dom"
import Logout from "../../logout"


const Navbar = () => {
    // State to track whether the mobile menu is open or closed
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, setUser } = useUser();

    return (
        <nav className="navbar">
            {/* Logo section - clicking on it redirects to home */}
            <div className="logo">
              {
                user ? (
                  <Link to="/gooddeed">
                      <img src={logo} alt="Logo" />
                  </Link>
                ) : (
                  <Link to="/login">
                    <img src={logo} alt="Logo" />
                  </Link>
                )
                
              }
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                {
                  user ? (
                    <>
                      <li><Link to="/streak">Check your Streak</Link></li>
                      <li><Link to="/gooddeed">Spread the Goodness</Link></li>
                      <li><Link to="/friends">Friends</Link></li>
                      <li><Logout /></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/login">Log In</Link></li>
                    </>
                  )}
            </ul>

            {/* Hamburger Menu Icon for Mobile View */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                &#9776; {/* Unicode character for a three-line menu (☰) */}
            </div>
        </nav>
    );
};

export default Navbar; // Export the Navbar component so it can be used in other files

