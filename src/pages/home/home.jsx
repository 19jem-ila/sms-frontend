import React from 'react';
import {useNavigate} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth);
  
  // Create click handler functions
  const handleLaunchDashboard = () => {
    if (user) {
      // If user is logged in, redirect based on role
      switch(user?.role) {
        case 'admin':
          navigate('/adminDashboard');
          break;
        case 'teacher':
          navigate('/teacherDashboard');
          break;
       
        default:
          navigate('/login');
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  const handleAccessPlatform = () => {
    if (user) {
      // If user is logged in, redirect based on role
      switch(user?.role) {
        case 'admin':
          navigate('/adminDashboard');
          break;
        case 'teacher':
          navigate('/teacherDashboard');
          break;
       
        default:
          navigate('/login');
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  };

  const features = [
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Comprehensive student performance insights and real-time attendance tracking with advanced analytics.'
    },
    {
      icon: '🎓',
      title: 'Grade Management',
      description: 'Efficiently manage and track academic progress across all subjects with automated reporting.'
    },
    {
      icon: '📚',
      title: 'Course Management',
      description: 'Organize and manage curriculum with precision, scheduling, and resource allocation.'
    },
    {
      icon: '👨‍🏫',
      title: 'Staff Management',
      description: 'Streamline teacher assignments, schedules, and performance monitoring in one platform.'
    },
    {
      icon: '💰',
      title: 'Fee Management',
      description: 'Automated fee tracking, payment processing, and financial reporting for seamless operations.'
    },
    {
      icon: '📅',
      title: 'Academic Calendar',
      description: 'Comprehensive scheduling of terms, exams, and institutional events with automated reminders.'
    }
  ];

  return (
    <div className="homepage">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-content">
            <div className="welcome-main-container">
              <h1 className="welcome-title">
                EduManage Pro
              </h1>
            </div>
            <p className="welcome-description">
              Transform educational institution management with our comprehensive enterprise platform. 
              Streamline operations, enhance productivity, and drive academic excellence.
            </p>
            <div className="welcome-actions">
              <button className="btn primary" onClick={handleLaunchDashboard}>
                {user ? `Go to ${user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} Dashboard` : 'Launch Dashboard'}
              </button>
              <button className="btn secondary" onClick={handleAdminLogin}>
                Administrator Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise-Grade Features</h2>
            <p>Comprehensive solutions designed for modern educational institutions</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Institution?</h2>
            <p className="cta-description">
              Join thousands of educational institutions already using EduManage Pro to streamline their operations.
            </p>
            <button className="btn primary large" onClick={handleAccessPlatform}>
              {user ? 'Go to Dashboard' : 'Access Platform'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;