import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, UserCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const [userName, setUserName] = useState('Loading...');

  // Get the user ID and auth token from localStorage
  const userId = localStorage.getItem('user_id');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    // Retrieve the username from localStorage
    const localName = localStorage.getItem('userName');
    if (localName) {
      setUserName(localName);
    } else {
      // Fallback to API call if the username is not in localStorage
      if (userId && authToken) {
        const fetchUserName = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/user/me', {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            });
            const data = await response.json();
            if (data.username) {
              setUserName(data.username);
              // Store the username in localStorage for future use
              localStorage.setItem('userName', data.username);
            } else {
              setUserName('Guest');
            }
          } catch (error) {
            console.error('Failed to fetch username:', error);
            setUserName('Guest');
          }
        };
        fetchUserName();
      } else {
        setUserName('Guest');
      }
    }
  }, [userId, authToken]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">FileStore</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {['/dashboard', '/upload', '/download', '/feedback'].map((path) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(path)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{userName}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="h-5 w-5 text-gray-300" /> : <Moon className="h-5 w-5 text-gray-700" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
