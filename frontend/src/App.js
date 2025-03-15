import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';
import { apiService } from './services/api';
import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [authError, setAuthError] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [authAttempted, setAuthAttempted] = useState(false);
  
  // Check backend server status
  useEffect(() => {
    console.log('Checking backend server status...');
    apiService.get('/health')
      .then(data => {
        console.log('Backend server response:', data);
        setServerStatus('Connected');
        setBackendError(null);
      })
      .catch(error => {
        console.error('Backend connection error:', error);
        setServerStatus('Disconnected');
        setBackendError(error.message || 'Failed to connect to backend server');
      });
  }, []);
  
  // Listen for authentication state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? `User authenticated: ${currentUser.uid}` : 'No user');
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error('Auth state error:', error);
      setAuthError(error.message || 'Authentication error occurred');
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in anonymously for testing
  const handleSignInAnonymously = () => {
    setLoading(true);
    setAuthAttempted(true);
    setAuthError(null);
    
    console.log('Attempting anonymous sign-in...');
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log('Anonymous sign-in successful:', userCredential.user.uid);
      })
      .catch((error) => {
        console.error('Anonymous sign-in error:', error);
        setAuthError(error.message || 'Failed to sign in anonymously');
        setLoading(false);
      });
  };

  if (loading && !authAttempted) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>UNIHACK 2025 Project</h1>
        
        <div className="status-container">
          <p>
            <strong>Firebase:</strong> {user ? 'Authenticated' : 'Not authenticated'}
            {authError && <div className="error">Error: {authError}</div>}
          </p>
          
          <p>
            <strong>Backend:</strong> {serverStatus}
            {backendError && <div className="error">Error: {backendError}</div>}
          </p>
        </div>
        
        {!user && (
          <button 
            onClick={handleSignInAnonymously}
            disabled={loading && authAttempted}
            style={{
              padding: '10px 20px',
              margin: '20px',
              backgroundColor: loading && authAttempted ? '#cccccc' : '#61dafb',
              border: 'none',
              borderRadius: '5px',
              cursor: loading && authAttempted ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading && authAttempted ? 'Signing in...' : 'Sign In Anonymously for Testing'}
          </button>
        )}
        
        {user && (
          <div className="user-info">
            <h3>User Information</h3>
            <p><strong>User ID:</strong> {user.uid}</p>
            <p><strong>Is Anonymous:</strong> {user.isAnonymous ? 'Yes' : 'No'}</p>
            <p><strong>Creation Time:</strong> {user.metadata?.creationTime}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
