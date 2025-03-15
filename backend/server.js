// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { google } = require('googleapis');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS - allow requests from frontend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());
const serviceAccount = require("./serviceAccountKey.json");
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()


// Initialize Google API client
const googleApiKey = process.env.GOOGLE_API_KEY;
const googleClient = google.auth.fromAPIKey(googleApiKey);
console.log('Google API client initialized successfully');

// Middleware to verify Firebase auth token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Create user endpoint
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  console.log('Username: ' + req.body);

  if (typeof username !== "string") {
    return res.status(400).json({ error: "Username must be string." });
  }

  const usernames = await db.collection('users').where('username', '==', username).get();
  if (!usernames.empty) {
    console.log('Username already exists');
    return res.status(400).json({ error: "Username already exists." });
  }

  try {
    const userRef = db.collection('users').doc();
    await userRef.set({
      username
    });
    res.status(201).json({ message: 'User created successfully', userId: userRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});