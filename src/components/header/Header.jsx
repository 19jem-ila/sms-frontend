import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      navigate('/adminDashboard');
    } else if (user?.role === 'teacher') {
      navigate('/teacherDashboard');
    } else {
      navigate('/dashboard');
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get first letter of user's name or email
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Format role for display
  const getRoleDisplay = () => {
    if (user?.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    return 'User';
  };

  return (
    <header className="sms-header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4648fd"/>
              <path d="M16 8L22 12L16 16L10 12L16 8Z" fill="#81f9f9"/>
              <path d="M10 12V20L16 24L22 20V12L16 16V24" fill="white" fillOpacity="0.8"/>
            </svg>
          </div>
          <span className="logo-text">EduManage</span>
        </div>

        {/* Auth Section */}
        <div className="auth-section">
          {user ? (
            // User is logged in - Show profile dropdown
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button 
                className="user-profile-btn"
                onClick={toggleDropdown}
              >
                <div className="user-avatar">
                  {getUserInitial()}
                </div>
                <span className="user-name">
                  {user.name || user.email}
                </span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                >
                  <path 
                    d="M4 6L8 10L12 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {/* User Info */}
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      {getUserInitial()}
                    </div>
                    <div className="dropdown-user-details">
                      <div className="dropdown-user-name">
                        {user.name || user.email}
                      </div>
                      <div className="dropdown-user-role">
                        {getRoleDisplay()}
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Dashboard Link */}
                  <button 
                    className="dropdown-item"
                    onClick={handleDashboardClick}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="3" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="12" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="16" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>
                      {user?.role === 'admin' ? 'Admin Dashboard' : 
                       user?.role === 'teacher' ? 'Teacher Dashboard' : 
                       'Dashboard'}
                    </span>
                  </button>

                  {/* Profile Link */}
                  <button 
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Profile</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  {/* Logout Button */}
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - Show login button
            <button className="login-btn" onClick={handleLoginClick}>
              <span>Login</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;