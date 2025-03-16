// Import required packages
const express = require("express");
const cors = require("cors");
const createGoodDeed = require("./models/good-deed");
// const generateCurrentDate = require("./models/good-deed");
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
      streak: 0, // Initialize streak
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
  console.log("Login-Request: " + req.body);
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
      return res
        .status(200)
        .json({
          message: "Login successful!",
          UserId: userSnapshot.docs[0].id,
          username: user.username,
          password: user.password,
          streak: user.streak,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

app.get("/api/kindness", async (req, res) => {
  try {
    console.log(`Generating kindness act...`);
    const { result, promptDate } = await createGoodDeed(); // Call the function to get a kindness act
    
    const currentDate = new Date();

    console.log("promptDate is", promptDate);
    
    const nextDay = new Date(promptDate);
    nextDay.setHours(0, 0, 0, 0);
    nextDay.setDate(promptDate.getDate() + 1);
    console.log(nextDay);
    const promptGenerated = false;

    if (currentDate.getTime() !== nextDay.getTime() && promptGenerated == false) {
      res.json({ act: result, promptGenerated: true });
    } else {
      console.log("error: cannot generate more than one act of kindness a day");
    };



  } catch (error) {
    console.error("Error fetching kindness act:", error);
    res.status(500).json({ error: "Failed to generate kindness act." });
  }

});

app.post("/api/completeGoodDeed", async (req, res) => {
  const { username, password, streak } = req.body;
  console.log("Completing good deed for user:", username);

  try {
    const querySnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const newStreak = (userData.streak || 0) + 1;

    await userDoc.ref.update({
      streak: newStreak,
    });

    return res.status(200).json({
      message: "Good deed completed successfully!",
      streak: newStreak,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return res.status(500).json({ error: "Failed to update streak" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});
