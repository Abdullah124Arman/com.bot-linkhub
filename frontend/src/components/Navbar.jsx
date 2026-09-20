import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Link2, User, LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <Zap size={22} />
        <span>LinkHub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard size={18} /><span>Dashboard</span>
        </Link>
        <Link to="/links" className={`nav-link ${isActive('/links') ? 'active' : ''}`}>
          <Link2 size={18} /><span>Links</span>
        </Link>
        <Link to="/bio-builder" className={`nav-link ${isActive('/bio-builder') ? 'active' : ''}`}>
          <User size={18} /><span>Bio</span>
        </Link>
      </div>
      <div className="navbar-user">
        <span className="username">@{user?.username}</span>
        <button onClick={handleLogout} className="btn-icon" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
