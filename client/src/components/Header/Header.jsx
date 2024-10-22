import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <header className="header-container">
      <h1 onClick={handleHomeRedirect} className="logo">EduVoyage</h1>

      <div className="search-container">
        <input type="text" placeholder="Search study programs..." />
        <button type="submit" className="search-button">
          <FaSearch className='search-icon' />
        </button>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="menu-icon">&#9776;</span>
      </div>

      <div className="login-signup-container">
        <Link to="/login" className="login-button">Login</Link>
        <Link to="/register-redirect" className="signup-button">Sign Up</Link>
      </div>
    </header>
  );
}

export default Header;
