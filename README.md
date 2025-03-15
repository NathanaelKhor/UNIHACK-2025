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

3. Create environment variables file:
```bash
cp .env.example .env
```

4. Update the `.env` file with the correct Firebase credentials (check with project admin if needed)

5. Start the backend server:
```bash
npm run dev
```

The server will start on port 5000 by default (http://localhost:5000).

## Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
cp .env.example .env
```

4. Start the React development server:
```bash
npm start
```

The React app will start on port 3000 by default (http://localhost:3000).

## Firebase Configuration

The project uses Firebase for authentication and database operations. Both frontend and backend are already configured to use Firebase, but if you need to make changes:

- Frontend: Firebase config is in `frontend/src/firebase.js`
- Backend: Firebase Admin SDK is initialized in `backend/server.js`

## API Communication

The frontend is configured to communicate with the backend API at `http://localhost:5000/api`. This configuration is in `.env` files of both projects.

## Available Endpoints

- `GET /api/health`: Check if the server is running
- `GET /api/user/profile`: Get current user profile (requires authentication)

## Troubleshooting

If you encounter issues with Firebase authentication or API communication:

1. Make sure both servers are running
2. Check that environment variables are properly set
3. Verify the Firebase credentials
4. Clear browser cache and try again

## Project Structure

- `/frontend`: React application
- `/backend`: Express server
- `/frontend/src/services`: API service for communicating with the backend
- `/backend/server.js`: Main server file with API routes

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
