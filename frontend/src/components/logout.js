import React from "react";
import { useUser } from "../context/UserContext"; // Import useUser to access state
import { Link } from "react-router-dom"; // Use Link to prevent full reload

const Logout = () => {
    const { user, setUser } = useUser();

    const handleLogout = () => {
        setUser(null); // Clears user state
    };

    return (
        <Link to="/" onClick={handleLogout} style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            Logout
        </Link>
    );
};

export default Logout;
