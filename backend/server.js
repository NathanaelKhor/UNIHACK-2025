const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

console.log('Starting server initialization...');

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
  console.log('Using service account from serviceAccountKey.json');
} catch (error) {
  console.error('Service account file error:', error.message);
  console.log('Attempting to use environment variables...');
  
  // If no service account file, use environment variables
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
  
  // Validate service account from env variables
  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    console.error('Missing Firebase credentials in environment variables');
    console.error('Ensure you have FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in your .env file');
    process.exit(1);
  }
  
  // Log service account info (without private key details)
  console.log('Service account info from env:', {
    projectId: serviceAccount.projectId,
    clientEmail: serviceAccount.clientEmail,
    privateKeyProvided: !!serviceAccount.privateKey
  });
}

// Initialize Firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.projectId}.firebaseio.com`,
  });
  console.log('Firebase Admin SDK initialized successfully');
  
  // Initialize Firestore
  const db = admin.firestore();
  console.log('Firestore initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  process.exit(1);
}

const app = express();

// Middleware
// Enable CORS for all origins in development for testing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    console.log('Authenticating request...');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided in Authorization header');
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('Token received, verifying with Firebase...');
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token verified successfully for user:', decodedToken.uid);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication process failed' });
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

// Public routes
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint accessed');
  res.status(200).json({ 
    status: 'Server is up and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test Firestore connection
app.get('/api/firebase-test', async (req, res) => {
  try {
    const timestamp = admin.firestore.Timestamp.now();
    await admin.firestore().collection('server_health').add({
      timestamp: timestamp,
      status: 'ok'
    });
    console.log('Firebase connection test successful');
    res.status(200).json({ 
      status: 'Firebase connection successful',
      timestamp: timestamp.toDate() 
    });
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    res.status(500).json({ 
      status: 'Firebase connection failed',
      error: error.message 
    });
  }
});

// Auth test endpoint - confirms if authentication is working
app.get('/api/auth-test', authenticateUser, (req, res) => {
  console.log('Auth test successful for user:', req.user.uid);
  res.status(200).json({ 
    authenticated: true, 
    uid: req.user.uid,
    email: req.user.email,
    isAnonymous: req.user.firebase?.sign_in_provider === 'anonymous'
  });
});

// Protected routes (require authentication)
app.get('/api/user/profile', authenticateUser, async (req, res) => {
  try {
    // The user ID from the verified token
    const uid = req.user.uid;
    console.log(`Fetching user profile for ${uid}`);
    
    // Here you would typically fetch user data from Firestore
    try {
      const userRecord = await admin.auth().getUser(uid);
      
      res.status(200).json({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        isAnonymous: req.user.firebase?.sign_in_provider === 'anonymous',
      });
    } catch (error) {
      console.error(`Error fetching user ${uid}:`, error);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
