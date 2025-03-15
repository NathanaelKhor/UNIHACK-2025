// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
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

// Initialize Firebase Admin SDK
try {
  // Check if using service account file or environment variables
  const serviceAccount = require('./serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://butter-butter.firebaseio.com'
  });
  
  console.log('Firebase Admin SDK initialized successfully using service account file');
} catch (error) {
  // Fallback to environment variables if service account file fails
  console.log('Service account file not found or invalid, using environment variables');
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://butter-butter.firebaseio.com'
  });
  
  console.log('Firebase Admin SDK initialized successfully using environment variables');
}

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
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password must be strings." });
  }

  try {
    const userRef = db.collection('users').doc();
    await userRef.set({
      username,
      password,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'User created successfully', userId: userRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// Create user endpoint
app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Username and password must be strings." });
  }

  try {
    const userRef = db.collection('users').doc();
    await userRef.set({
      username,
      password,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'User created successfully', userId: userRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Protected route example
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    // Get user data from Firebase Auth
    const userRecord = await admin.auth().getUser(req.user.uid);
    
    // Return user profile data
    res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email || 'Anonymous user',
      displayName: userRecord.displayName || 'Anonymous user',
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      isAnonymous: req.user.firebase && req.user.firebase.sign_in_provider === 'anonymous'
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});