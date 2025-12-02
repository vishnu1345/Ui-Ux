import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardActive = location.pathname === '/dashboard';
  const isProfileActive = location.pathname === '/profile';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Skill Mingle</h2>
        <span className="welcome-text">Welcome, {user?.name || 'User'}</span>
      </div>
      <div className="navbar-right">
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`nav-link ${isDashboardActive ? 'active' : ''}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => navigate('/profile')} 
          className={`nav-link ${isProfileActive ? 'active' : ''}`}
        >
          View Profile
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

