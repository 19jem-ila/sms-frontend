import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { 
  MailOutlined, 
  CheckCircleOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import {
  Card,
  Input,
  Button,
  Alert,
  Spin,
  Typography,
  Space,
  Divider
} from 'antd';
import { forgotPassword, resetState } from '../../store/slices/authSlice';

const { Title, Text, Paragraph } = Typography;

// Color scheme matching your login page
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
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(forgotPassword(values.email)).unwrap();
    } catch (error) {
      console.error('Forgot password failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    dispatch(resetState());
    setShowSuccess(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
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
            <MailOutlined style={{ fontSize: 24, color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            color: colorScheme.textPrimary,
            margin: 0,
            fontWeight: 600
          }}>
            Reset Your Password
          </Title>
          <Paragraph style={{ 
            color: colorScheme.textSecondary,
            margin: '8px 0 0 0',
            textAlign: 'center'
          }}>
            Enter your email address and we'll send you a link to reset your password.
          </Paragraph>
        </div>

        {/* Error Alert */}
        {isError && !showSuccess && (
          <Alert
            message="Request Failed"
            description={message}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
          />
        )}

        {/* Success State */}
        {showSuccess ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              backgroundColor: '#f6ffed',
              border: `2px solid ${colorScheme.secondary}`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <CheckCircleOutlined style={{ fontSize: 36, color: colorScheme.secondary }} />
            </div>
            
            <Title level={3} style={{ color: colorScheme.textPrimary, marginBottom: 8 }}>
              Check Your Email
            </Title>
            
            <Paragraph style={{ 
              color: colorScheme.textSecondary,
              marginBottom: 32,
              fontSize: 16
            }}>
              We've sent a password reset link to your email address. 
              Please check your inbox and follow the instructions.
            </Paragraph>

            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleResetForm}
                style={{
                  height: 48,
                  borderRadius: 6,
                  backgroundColor: colorScheme.primary,
                  borderColor: colorScheme.primary,
                  fontSize: 16,
                  fontWeight: 500
                }}
              >
                Send Another Link
              </Button>
              
              <Button
                type="default"
                size="large"
                block
                icon={<ArrowLeftOutlined />}
                onClick={handleResetForm}
                style={{
                  height: 48,
                  borderRadius: 6
                }}
              >
                Back to Login
              </Button>
            </Space>
          </div>
        ) : (
          /* Forgot Password Form */
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form>
                <Space direction="vertical" size={24} style={{ width: '100%' }}>

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
                          placeholder="Enter your email address"
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
                  >
                    {isLoading || isSubmitting ? <Spin size="small" /> : 'Send Reset Link'}
                  </Button>

                </Space>
              </Form>
            )}
          </Formik>
        )}

        {/* Back to Login Link */}
        {!showSuccess && (
          <>
            <Divider style={{ color: colorScheme.textSecondary, margin: '24px 0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: colorScheme.textSecondary }}>
                Remember your password?{' '}
                <Link 
                  to="/login"
                  style={{
                    color: colorScheme.primary,
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Back to Login
                </Link>
              </Text>
            </div>
          </>
        )}

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

export default ForgotPassword;