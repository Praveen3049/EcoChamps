import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizPage from './pages/QuizPage';
import EcoTasksPage from './pages/EcoTasksPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PVPChallengesPage from './pages/PVPChallengesPage';
import PVPChallengePlayPage from './pages/PVPChallengePlayPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/Common/PrivateRoute';
import { isAuthenticated, removeToken } from './services/auth';

// Placeholder for HomePage
const HomePage = () => <h1>Welcome to EcoChamps</h1>;

// Dynamic Navbar
const Navbar = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    // This is a simple way to re-check auth state on navigation
    // A more robust solution might use context or state management libraries
    setIsAuth(isAuthenticated());
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">EcoChamps</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isAuth ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lessons">Lessons</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/quizzes">Quizzes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ecotasks">EcoTasks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pvp">PvP Challenges</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="" element={<DashboardPage />} />
            </Route>
            <Route path="/lessons" element={<PrivateRoute />}>
              <Route path="" element={<LessonsPage />} />
              <Route path=":lessonId" element={<LessonDetailPage />} />
            </Route>
            <Route path="/quizzes" element={<PrivateRoute />}>
              <Route path="" element={<QuizzesPage />} />
              <Route path=":quizId" element={<QuizPage />} />
            </Route>
            <Route path="/ecotasks" element={<PrivateRoute />}>
              <Route path="" element={<EcoTasksPage />} />
            </Route>
            <Route path="/pvp" element={<PrivateRoute />}>
              <Route path="" element={<PVPChallengesPage />} />
              <Route path="play/:challengeId" element={<PVPChallengePlayPage />} />
            </Route>
            <Route path="/leaderboard" element={<PrivateRoute />}>
              <Route path="" element={<LeaderboardPage />} />
            </Route>
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="" element={<ProfilePage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
