import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

console.log('Initializing Firebase...');

// Direct Firebase configuration to ensure it works
const firebaseConfig = {
  apiKey: "AIzaSyDirb_pPetaQ60PbvX8c2WlhT6hzbiW8wA",
  authDomain: "butter-butter.firebaseapp.com",
  projectId: "butter-butter",
  storageBucket: "butter-butter.appspot.com",
  messagingSenderId: "792246354181",
  appId: "1:792246354181:web:fcb85cf4c7caf5bac9b76c",
  measurementId: "G-BD9PSHTSLX"
};

console.log('Firebase config loaded:', { 
  ...firebaseConfig, 
  apiKey: '***' // Hide API key in logs
});

// Initialize Firebase
let app, auth, db, analytics;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firebase services
  auth = getAuth(app);
  console.log('Firebase auth initialized:', !!auth);
  
  db = getFirestore(app);
  console.log('Firebase db initialized:', !!db);
  
  // Only initialize analytics on the client side
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase analytics initialized');
    } catch (error) {
      console.warn('Analytics initialization failed:', error.message);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message, error);
}

export { app, auth, db, analytics };
