# Butter Butter - Random Acts of Kindness

This application encourages daily acts of kindness by providing users with suggestions for good deeds and tracking their "kindness streaks." The project was created for UNIHACK 2025.

## 🌟 Features

- **Daily Good Deed Suggestions**: Receive a new random act of kindness suggestion each day
- **Streak Tracking**: Build and maintain your kindness streak by completing good deeds daily
- **Friend System**: Connect with friends to see their kindness streaks
- **Firebase Authentication**: Secure user accounts and data
- **Mobile Responsive**: Works on desktop and mobile devices

## 📋 Project Overview

Butter Butter is a web application built with:

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **AI Integration**: Google Gemini AI for generating kindness suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Git
- Firebase account with Firestore database

### Initial Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd UNIHACK-2025
```

### Backend Setup

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

4. Update the `.env` file with the following values:

```
PORT=5001
CLIENT_URL=http://localhost:3000
GOOGLE_API_KEY=your_google_api_key
```

5. Make sure the Firebase service account key (`serviceAccountKey.json`) is in the backend directory

6. Start the backend server:

```bash
npm run dev
```

The server will start on port 5001 by default (http://localhost:5001).

### Frontend Setup

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

4. Update the `.env` file with:

```
REACT_APP_API_URL=http://localhost:5001/api
```

5. Start the React development server:

```bash
npm start
```

The React app will start on port 3000 by default (http://localhost:3000).

## 🔥 Firebase Configuration

The project uses Firebase for authentication and database operations:

- **Frontend**: Firebase config is in `frontend/src/firebase.js`
- **Backend**: Firebase Admin SDK is initialized in `backend/server.js`

If you need to set up your own Firebase project:

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Generate a web app configuration and update `frontend/src/firebase.js`
5. Generate a service account key and save as `backend/serviceAccountKey.json`

## 📡 API Endpoints

| Endpoint                | Method | Description                   | Authentication Required |
| ----------------------- | ------ | ----------------------------- | ----------------------- |
| `/api/users`            | POST   | Create a new user             | No                      |
| `/api/login`            | POST   | Login a user                  | No                      |
| `/api/kindness`         | POST   | Get a random act of kindness  | Yes                     |
| `/api/completeGoodDeed` | POST   | Mark a good deed as completed | Yes                     |
| `/api/addFriend`        | POST   | Add a friend                  | Yes                     |

## 📱 Application Flow

1. Users register/login to the application
2. On the Good Deed page, users can generate a random act of kindness
3. After completing the suggested act, users mark it as completed
4. The application tracks and displays the user's streak
5. Users can add friends and see their streaks

## 🚧 Troubleshooting

If you encounter issues:

1. Make sure both frontend and backend servers are running
2. Check that environment variables are properly set
3. Verify the Firebase credentials are correct
4. Clear browser cache and try again
5. Check server logs for any error messages

## 🧰 Development Workflow

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

## 📁 Project Structure

- `/frontend`: React application
  - `/src/components`: UI components
  - `/src/context`: React context for state management
  - `/src/services`: API service for backend communication
- `/backend`: Express server
  - `/models`: Data models
  - `server.js`: Main server file with API routes

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
