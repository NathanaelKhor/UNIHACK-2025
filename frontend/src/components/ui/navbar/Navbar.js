import React, { useState } from "react"; // Import React and useState for state management
import "./Navbar.css"; // Import external CSS for styling
import logo from "../../assets/linelogo.png"; // Import the logo image

const Navbar = () => {
    // State to track whether the mobile menu is open or closed
    const [menuOpen, setMenuOpen] = useState(false);

    
    return (
        <nav className="navbar">
            {/* Logo section - clicking on it redirects to home */}
            <div className="logo">
                <a href="/">
                    <img src={logo} alt="Logo" />
                </a>
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li><a href="/login">Login</a></li>
            </ul>

            {/* Hamburger Menu Icon for Mobile View */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                &#9776; {/* Unicode character for a three-line menu (☰) */}
            </div>
        </nav>
    );
};

export default Navbar; // Export the Navbar component so it can be used in other files

