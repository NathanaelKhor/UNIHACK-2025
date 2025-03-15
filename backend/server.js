// Import required packages
const express = require("express");
const cors = require("cors");
const createGoodDeed = require('./models/good-deed');
const dotenv = require("dotenv");

const { google } = require("googleapis");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS - allow requests from frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Set up firebase
app.use(express.json());
const serviceAccount = require("./serviceAccountKey.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Initialize Google API client
const googleApiKey = process.env.GOOGLE_API_KEY;
const googleClient = google.auth.fromAPIKey(googleApiKey);
console.log("Google API client initialized successfully");

// Create user endpoint
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  console.log("Username: " + req.body);

  if (typeof username !== "string") {
    return res.status(400).json({ error: "Username must be string." });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ error: "Password must be string." });
  }
  const usernames = await db
    .collection("users")
    .where("username", "==", username)
    .get();
  if (!usernames.empty) {
    console.log("Username already exists");
    return res.status(400).json({ error: "Username already exists." });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
  }

  try {
    const userRef = db.collection("users").doc();
    await userRef.set({
      username,
      password,
      streak: 0,
    });
    res
      .status(201)
      .json({ message: "User created successfully", userId: userRef.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login-Request: Username - " + req.body.username + " | Password - " + req.body.password);
  try {
    // Check if user exists in Firebase Authentication
    const userSnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (userSnapshot.empty) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const user = userSnapshot.docs[0].data();
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password." });
    } else {
      console.log(user);
      return res
        .status(200)
        .json(user);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

app.post("/api/kindness", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists in Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(username); // You can use email as username in Firebase
    if (!userRecord) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});


app.get("/api/kindness", async (req, res) => {
  try {
    console.log(`Generating kindness act...`);
    const { result } = await createGoodDeed(); // Call the function to get a kindness act
    res.json({ act: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});
