import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold mb-2 sm:mb-0">
          🌎 Countries Explorer
        </Link>
        
        <nav className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="hover:text-blue-200 transition-colors">
                Favorites
              </Link>
              <span className="text-blue-200">
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;