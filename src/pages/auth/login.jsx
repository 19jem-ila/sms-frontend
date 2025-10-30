import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  HomeOutlined
} from '@ant-design/icons';
import {
  Card,
  Input,
  Button,
  Alert,
  Spin,
  Typography,
  Divider,
  Space
} from 'antd';
import { login, resetState } from '../../store/slices/authSlice.js';

const { Title, Text, Paragraph } = Typography;

// Color scheme from your home page
const colorScheme = {
  primary: '#1890ff',       // Professional blue
  secondary: '#52c41a',     // Success green
  accent: '#faad14',        // Warning gold
  background: '#f0f2f5',    // Light gray background
  cardBg: '#ffffff',        // White card background
  textPrimary: '#ffffff',   // Dark gray text
  textSecondary: '#8c8c8c', // Light gray text
  border: '#d9d9d9'         // Light border
};

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, message, isSuccess } = useSelector((state) => state.auth);

  React.useEffect(() => {
    // Reset state when component unmounts
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  // Auto-hide alerts after 5 seconds
  React.useEffect(() => {
    let timer;
    if (isSuccess || isError) {
      timer = setTimeout(() => {
        dispatch(resetState());
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess, isError, dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      // Login successful - redirect will be handled by protected routes
    } catch (error) {
      // Error is handled by the slice
      console.error('Login failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      
      {/* Back to Home Link - Added at top left */}
      <Link 
        to="/"
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          transition: 'all 0.3s ease',
          fontWeight: 500,
          zIndex: 100
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          e.target.style.textDecoration = 'none';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <HomeOutlined />
        
      </Link>

      {/* Toast Notifications */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: '400px'
      }}>
        {isError && (
          <Alert
            message="Login Failed"
            description={message}
            type="error"
            showIcon
            closable
            onClose={() => dispatch(resetState())}
            style={{ 
              marginTop:40,
              marginBottom: 10,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          />
        )}
        
        {isSuccess && (
          <Alert
            message="Login Successful"
            
            type="success"
            showIcon
            closable
            onClose={() => dispatch(resetState())}
            style={{ 
              marginTop:60,
              marginBottom: 10,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          />
        )}
      </div>

      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colorScheme.border}`,
          borderRadius: 12,
          backgroundColor: colorScheme.cardBg
        }}
        bodyStyle={{ padding: 40 }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60,
            height: 60,
            backgroundColor: colorScheme.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UserOutlined style={{ fontSize: 24, color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            color: colorScheme.textPrimary,
            margin: 0,
            fontWeight: 600
          }}>
            Welcome Back
          </Title>
          <Paragraph style={{ 
            color: colorScheme.textSecondary,
            margin: '8px 0 0 0'
          }}>
            Sign in to your account to continue
          </Paragraph>
        </div>

        {/* Login Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
            <Form>
              <Space direction="vertical" size={20} style={{ width: '100%' }}>

                {/* Email Field */}
                <div>
                  <Text strong style={{ 
                    color: colorScheme.textPrimary,
                    marginBottom: 8,
                    display: 'block'
                  }}>
                    Email Address
                  </Text>
                  <Field name="email">
                    {({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter your email"
                        prefix={<MailOutlined style={{ color: colorScheme.textSecondary }} />}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        status={touched.email && errors.email ? 'error' : ''}
                        style={{
                          borderRadius: 6,
                          borderColor: touched.email && errors.email ? '#ff4d4f' : colorScheme.border
                        }}
                      />
                    )}
                  </Field>
                  {touched.email && errors.email && (
                    <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                      {errors.email}
                    </Text>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Text strong style={{ 
                    color: colorScheme.textPrimary,
                    marginBottom: 8,
                    display: 'block'
                  }}>
                    Password
                  </Text>
                  <Field name="password">
                    {({ field }) => (
                      <Input.Password
                        {...field}
                        size="large"
                        placeholder="Enter your password"
                        prefix={<LockOutlined style={{ color: colorScheme.textSecondary }} />}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        status={touched.password && errors.password ? 'error' : ''}
                        style={{
                          borderRadius: 6,
                          borderColor: touched.password && errors.password ? '#ff4d4f' : colorScheme.border
                        }}
                      />
                    )}
                  </Field>
                  {touched.password && errors.password && (
                    <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                      {errors.password}
                    </Text>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right' }}>
                  <Link 
                    to="/forgot-password"
                    style={{
                      color: colorScheme.primary,
                      fontSize: 14,
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading || isSubmitting}
                  style={{
                    height: 48,
                    borderRadius: 6,
                    backgroundColor: colorScheme.primary,
                    borderColor: colorScheme.primary,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#40a9ff';
                    e.target.style.borderColor = '#40a9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colorScheme.primary;
                    e.target.style.borderColor = colorScheme.primary;
                  }}
                >
                  {isLoading || isSubmitting ? <Spin size="small" /> : 'Sign In'}
                </Button>

              </Space>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <Divider style={{ color: colorScheme.textSecondary, margin: '24px 0' }}>
          or
        </Divider>

        {/* Additional Links */}
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: colorScheme.textSecondary }}>
            Don't have an account?{' '}
            <Link 
              to="/register"
              style={{
                color: colorScheme.primary,
                fontWeight: 500,
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign up
            </Link>
          </Text>
        </div>

        {/* Loading Overlay */}
        {(isLoading) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12
          }}>
            <Spin size="large" />
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;