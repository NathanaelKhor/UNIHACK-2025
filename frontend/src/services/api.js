import { auth } from '../firebase';

// Use the environment variable but default to port 5001 since that's what's in your .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

console.log('API Service initialized with URL:', API_URL);

/**
 * Get the current user's ID token
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found when requesting token');
    return null;
  }
  
  try {
    const token = await user.getIdToken(true); // Force refresh the token
    console.log('Authentication token obtained successfully');
    return token;
  } catch (error) {
    console.error('Error getting authentication token:', error);
    return null;
  }
};

/**
 * Wrapper for fetch that includes authentication token and error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`API request to ${fullUrl}`);
    
    // Set up headers with content type
    let headers = { 'Content-Type': 'application/json' };
    
    // Get authentication token if user is signed in
    const token = await getAuthToken();
    if (token) {
      console.log('Adding auth token to request');
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Merge with any provided headers
    if (options.headers) {
      headers = { ...headers, ...options.headers };
    }
    
    // Make the request
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log(`Response status: ${response.status}`);
    
    // Try to parse JSON, but handle cases where response might not be JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const apiService = {
  // GET request
  get: (endpoint) => fetchWithAuth(endpoint),
  
  // POST request
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // PUT request
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // DELETE request
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE',
  }),
};
