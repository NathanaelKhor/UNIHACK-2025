import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Wrapper for fetch that includes authentication token and error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    // Get the current user's ID token
    const user = auth.currentUser;
    let headers = { 'Content-Type': 'application/json' };
    
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const apiService = {
  // Example GET request
  get: (endpoint) => fetchWithAuth(endpoint),
  
  // Example POST request
  post: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Example PUT request
  put: (endpoint, data) => fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Example DELETE request
  delete: (endpoint) => fetchWithAuth(endpoint, {
    method: 'DELETE',
  }),
};
