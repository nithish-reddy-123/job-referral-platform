import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { HiBell, HiMenu, HiX, HiUser, HiLogout, HiCog, HiBriefcase, HiSun, HiMoon } from 'react-icons/hi';
import { logoutUser } from '../../store/slices/authSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications({ limit: 5 }));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ReferHub</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/jobs" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">
                Jobs
              </Link>
              <Link to="/companies" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">
                Companies
              </Link>
              {isAuthenticated && (
                <>
                  {(user?.role === 'referrer' || user?.role === 'admin') && (
                    <Link to="/post-job" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">
                      Post a Job
                    </Link>
                  )}
                  <Link to="/referrals" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">
                    Referrals
                  </Link>
                  <Link to="/messages" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">
                    Messages
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <HiBell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                      {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      )}
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileMenuOpen(false)}>
                        <HiUser className="mr-3 h-4 w-4" /> Profile
                      </Link>
                      {user?.role === 'referrer' && (
                        <Link to="/my-jobs" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileMenuOpen(false)}>
                          <HiBriefcase className="mr-3 h-4 w-4" /> My Jobs
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setProfileMenuOpen(false)}>
                          <HiCog className="mr-3 h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <HiLogout className="mr-3 h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-2">
            <Link to="/jobs" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
            <Link to="/companies" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Companies</Link>
            {isAuthenticated && (
              <>
                {(user?.role === 'referrer' || user?.role === 'admin') && (
                  <>
                    <Link to="/post-job" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Post a Job</Link>
                    <Link to="/my-jobs" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Jobs</Link>
                  </>
                )}
                <Link to="/referrals" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Referrals</Link>
                <Link to="/messages" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Messages</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
