import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, List, LogOut, Plus, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!authState.isAuthenticated) {
    return (
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">EV Charging</Link>
          <div className="space-x-4">
            <Link to="/login" className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/login' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
              Login
            </Link>
            <Link to="/register" className={`px-4 py-2 rounded-md transition-colors ${location.pathname === '/register' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
              Register
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">EV Charging</Link>
        <nav className="flex space-x-1 md:space-x-4">
          <Link 
            to="/" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <List className="mr-1 h-5 w-5" />
            <span>Stations</span>
          </Link>
          <Link 
            to="/map" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${location.pathname === '/map' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <MapPin className="mr-1 h-5 w-5" />
            <span>Map</span>
          </Link>
          <Link 
            to="/stations/new" 
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${location.pathname === '/stations/new' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <Plus className="mr-1 h-5 w-5" />
            <span>Add Station</span>
          </Link>
          <div className="relative group">
            <button className="flex items-center px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <User className="mr-1 h-5 w-5" />
              <span>{authState.user?.name || authState.user?.email}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
              <div className="py-2">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;