import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDirb_pPetaQ60PbvX8c2WlhT6hzbiW8wA",
  authDomain: "butter-butter.firebaseapp.com",
  projectId: "butter-butter",
  storageBucket: "butter-butter.firebasestorage.app",
  messagingSenderId: "792246354181",
  appId: "1:792246354181:web:fcb85cf4c7caf5bac9b76c",
  measurementId: "G-BD9PSHTSLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
