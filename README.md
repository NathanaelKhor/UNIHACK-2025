# UNIHACK 2025 Project Setup

This repository contains both frontend and backend components for our UNIHACK 2025 project. Follow these instructions to get the project up and running on your local machine.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Git

## Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd UNIHACK-2025
```

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Configuration:
   - The backend is already configured to use Firebase using two methods:
     - Primary: Using the `serviceAccountKey.json` file already in the project
     - Fallback: Using environment variables from `.env` file
   - No additional setup is needed as both configurations are already included

4. Start the backend server:
```bash
npm run dev
```

The server will start on port 5001 by default (http://localhost:5001).

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Configuration:
   - The frontend is already configured to use Firebase with the `firebase.js` file
   - Environment variables are already set in the `.env` file
   - No additional configuration needed unless you want to use your own Firebase project

4. Start the React development server:
```bash
npm start
```

The React app will start on port 3000 by default (http://localhost:3000).

## Verifying the Setup

1. Check that the backend server is running:
   - Open http://localhost:5001/api/health in your browser
   - You should see: `{"status":"ok","message":"Server is running"}`

2. Check that the frontend is connected to Firebase:
   - Open http://localhost:3000 in your browser
   - You should see the status of Firebase and Backend connections
   - You can click "Sign In Anonymously for Testing" to test Firebase authentication

## Firebase Integration Details

The project uses Firebase for authentication and database operations:

- **Frontend Integration**: 
  - Firebase Web SDK is initialized in `frontend/src/firebase.js`
  - Authentication state is managed in `App.js`
  
- **Backend Integration**:
  - Firebase Admin SDK is initialized in `backend/server.js`
  - Uses service account credentials for secure server-side operations
  - Protected routes use Firebase token verification middleware

## API Communication

The frontend is configured to communicate with the backend API at `http://localhost:5001/api`. This configuration is in `.env` files of both projects.

## Available Endpoints

- `GET /api/health`: Check if the server is running
- `GET /api/user/profile`: Get current user profile (requires authentication)

## Troubleshooting

If you encounter issues with Firebase authentication or API communication:

1. Make sure both servers are running
2. Check that environment variables are properly set
3. Verify the Firebase credentials
4. Clear browser cache and try again
5. Check the browser console and server logs for specific error messages

## Project Structure

- `/frontend`: React application
- `/backend`: Express server
- `/frontend/src/services`: API service for communicating with the backend
- `/backend/server.js`: Main server file with API routes and Firebase configuration

## Development Workflow

1. Create your feature branch from main:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and test locally
3. Commit your changes:
```bash
git add .
git commit -m "Add your meaningful commit message"
```

4. Push to your branch:
```bash
git push origin feature/your-feature-name
```

5. Create a pull request for review
