import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";
import { apiService } from "./services/api";
import logo from "./logo.svg";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/ui/navbar/Navbar";
import Login from ".//components/login/login";
import GoodDeed from "./components/gooddeed/gooddeed";
import Register from "./components/register/register";
import { UserContext, UserProvider, useUser } from "./context/UserContext";
import Streak from "./components/streak/streak"
import Friends from "./components/friends/friends";

const ProtectedRoute = ({ element }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? element : null;
};

function App() {
  const {user, setUser} = useUser()
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [authError, setAuthError] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [authAttempted, setAuthAttempted] = useState(false);

  // Check backend server status
  useEffect(() => {
    console.log("Checking backend server status...");
    apiService
      .get("/health")
      .then((data) => {
        console.log("Backend server response:", data);
        setServerStatus("Connected");
        setBackendError(null);
      })
      .catch((error) => {
        console.error("Backend connection error:", error);
        setServerStatus("Disconnected");
        setBackendError(error.message || "Failed to connect to backend server");
      });
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        console.log(
          "Auth state changed:",
          currentUser ? `User authenticated: ${currentUser.uid}` : "No user"
        );
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state error:", error);
        setAuthError(error.message || "Authentication error occurred");
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in anonymously for testing
  const handleSignInAnonymously = () => {
    setLoading(true);
    setAuthAttempted(true);
    setAuthError(null);

    console.log("Attempting anonymous sign-in...");
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log("Anonymous sign-in successful:", userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Anonymous sign-in error:", error);
        setAuthError(error.message || "Failed to sign in anonymously");
        setLoading(false);
      });
  };

  if (loading && !authAttempted) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <title>Butter Butter</title>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/gooddeed"
            element={<ProtectedRoute element={<GoodDeed />} />}
          />
          <Route path="/" element={<Navigate to="/gooddeed" />} />
          <Route path="/streak" element={<ProtectedRoute element={<Streak />} />}></Route>
          <Route path="/friends" element={<ProtectedRoute element={<Friends />} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
