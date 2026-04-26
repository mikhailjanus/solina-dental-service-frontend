import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Settings, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(location.pathname.startsWith('/admin') ? '/login' : '/');
    setIsOpen(false);
  };

  let navLinks;
  if (location.pathname === '/') {
    // On home page: show only Home and Appointment
    navLinks = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Appointment', path: '/appointments', icon: Calendar }
    ];
  } else {
    // On other pages: show links based on auth and role
    navLinks = user ? [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Profile', path: '/profile', icon: User },
      ...(user.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: Settings }] : [])
    ] : [
      { name: 'Home', path: '/', icon: Home }
    ];
  }

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
          
           {/* Desktop Menu */}
           <div className="hidden md:flex items-center space-x-6">
             {navLinks.map((link) => (
               <Link
                 key={link.name}
                 to={link.path}
                 className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
               >
                 <link.icon className="w-4 h-4" />
                 {link.name}
               </Link>
             ))}
             
             {user ? (
               <button
                 onClick={handleLogout}
                 className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
               >
                 <LogOut className="w-4 h-4" />
                 Logout
               </button>
             ) : location.pathname !== '/' && (
               <div className="flex items-center gap-3">
                 <Link
                   to="/login"
                   className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                 >
                   Login
                 </Link>
               </div>
             )}
           </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all py-3 px-4 rounded-lg font-medium flex items-center gap-3"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              
               {user ? (
                 <button
                   onClick={handleLogout}
                   className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-3 mt-2"
                 >
                   <LogOut className="w-5 h-5" />
                   Logout
                 </button>
               ) : location.pathname !== '/' && (
                 <div className="flex flex-col gap-3 mt-2">
                   <Link
                     to="/login"
                     onClick={() => setIsOpen(false)}
                     className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all py-3 px-4 rounded-lg font-medium text-center"
                   >
                     Login
                   </Link>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;