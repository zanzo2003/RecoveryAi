import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">🧠 RecoverAI</div>
      <div className="navbar-links">
        <Link to="/chat" className={isActive('/chat')}>Chat</Link>
        <Link to="/journal" className={isActive('/journal')}>Journal</Link>
        <Link to="/caregiver" className={isActive('/caregiver')}>Caregiver</Link>
      </div>
      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
