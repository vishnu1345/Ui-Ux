# Skill Mingle

A comprehensive skill assessment platform where users can create profiles, add their skills, experiences, and projects, and take skill assessments to get certified levels (Beginner, Intermediate, Expert).

## Features

- **User Authentication**: Register and Login system
- **Profile Management**: 
  - Personal information (name, contact)
  - Multiple experiences with add/remove functionality
  - Multiple projects with add/remove functionality
  - Skill selection from pre-listed skills with search functionality
  - Achievements and Certifications
- **Skill Assessments**: Take assessments for selected skills
- **Results Classification**: Skills are classified as Beginner, Intermediate, or Expert based on assessment scores
- **Profile View**: Comprehensive profile view with skills report for recruiters

## Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v20.19.0 or >=22.12.0)
- MongoDB (local or MongoDB Atlas)

### Quick Start

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up backend environment:
   - Navigate to `backend` directory
   - Create a `.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/skillmingle
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

3. Make sure MongoDB is running (local or use MongoDB Atlas)

4. Start both servers (from root directory):
```bash
npm install -g concurrently  # Install concurrently globally (optional)
npm run dev
```

Or start them separately:

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/skillmingle
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

4. Start MongoDB (if running locally):
```bash
# Make sure MongoDB is running on your system
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. **Register**: Create a new account with name, email, and password
2. **Login**: Login with your credentials
3. **Dashboard**: 
   - Fill in your profile information
   - Add experiences, projects, skills, achievements, and certifications
   - Submit your profile
4. **Take Assessments**: After submitting your profile, you can take skill assessments for each selected skill
5. **View Profile**: See your complete profile with skills report, experiences, projects, and assessment history

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

### Skills
- `GET /api/skills` - Get all skills (with optional search query)
- `POST /api/skills/seed` - Seed default skills

### Assessments
- `GET /api/assessments/:skill` - Get assessment questions for a skill
- `POST /api/assessments/submit` - Submit assessment answers (requires auth)

## Project Structure

```
skill-mingle/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Skill.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── profile.js
│   │   ├── skills.js
│   │   └── assessments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Assessment.css
│   │   │   └── Profile.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Notes

- Skills are automatically seeded when you first access the skills API
- Assessment questions are generated based on the skill (currently supports JavaScript, React, and Python with fallback)
- Skill levels are determined by assessment scores:
  - Expert: 80% and above
  - Intermediate: 50% to 79%
  - Beginner: Below 50%

## License

ISC

