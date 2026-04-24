import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-blue-600 text-xl font-bold flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7.391 3.127c-.842.17-1.539.652-2.055 1.504-1.01 1.65-1.084 4.644.242 7.104a2 2 0 0 1 .178.43c.452 1.676.914 5.046 1.583 7.71.4 1.596 1.691 1.265 1.94-.362.456-2.971 1.34-5.862 2.708-5.862 1.367 0 2.253 2.892 2.71 5.862.25 1.628 1.54 1.96 1.94.363.67-2.666 1.13-6.038 1.581-7.712a2 2 0 0 1 .178-.428c1.39-2.568 1.258-5.452.241-7.11q-.782-1.274-2.057-1.501c-.712-.122-1.497.02-2.302.414a5.34 5.34 0 0 1-4.592-.001c-.619-.301-1.708-.53-2.295-.411"/>
            </svg>
            Solina Dental Service
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-600 text-sm hidden sm:inline">
              Welcome, {user?.firstName}
            </span>
            
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
            >
              <User className="w-6 h-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
