import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  LockOutlined, 
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined
} from '@ant-design/icons';
import {
  Card,
  Input,
  Button,
  Alert,
  Spin,
  Typography,
  Space
} from 'antd';
import { resetPassword, resetState } from '../../store/slices/authSlice';

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
const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const { token } = useParams();
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

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
      await dispatch(resetPassword({ 
        token, 
        newPassword: values.newPassword 
      })).unwrap();
    } catch (error) {
      console.error('Reset password failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!token) {
    return null;
  }

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
            <LockOutlined style={{ fontSize: 24, color: 'white' }} />
          </div>
          <Title level={2} style={{ 
            color: colorScheme.textPrimary,
            margin: 0,
            fontWeight: 600
          }}>
            Create New Password
          </Title>
          <Paragraph style={{ 
            color: colorScheme.textSecondary,
            margin: '8px 0 0 0',
            textAlign: 'center'
          }}>
            Your new password must be different from previously used passwords.
          </Paragraph>
        </div>

        {/* Error Alert */}
        {isError && !showSuccess && (
          <Alert
            message="Reset Failed"
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
              Password Reset Successful
            </Title>
            
            <Paragraph style={{ 
              color: colorScheme.textSecondary,
              marginBottom: 32,
              fontSize: 16
            }}>
              Your password has been successfully reset. You can now login with your new password.
            </Paragraph>

            <Button
              type="primary"
              size="large"
              block
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToLogin}
              style={{
                height: 48,
                borderRadius: 6,
                backgroundColor: colorScheme.primary,
                borderColor: colorScheme.primary,
                fontSize: 16,
                fontWeight: 500
              }}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          /* Reset Password Form */
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form>
                <Space direction="vertical" size={20} style={{ width: '100%' }}>

                  {/* New Password Field */}
                  <div>
                    <Text strong style={{ 
                      color: colorScheme.textPrimary,
                      marginBottom: 8,
                      display: 'block'
                    }}>
                      New Password
                    </Text>
                    <Field name="newPassword">
                      {({ field }) => (
                        <Input.Password
                          {...field}
                          size="large"
                          placeholder="Enter new password"
                          prefix={<LockOutlined style={{ color: colorScheme.textSecondary }} />}
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          status={touched.newPassword && errors.newPassword ? 'error' : ''}
                          style={{
                            borderRadius: 6,
                            borderColor: touched.newPassword && errors.newPassword ? '#ff4d4f' : colorScheme.border
                          }}
                        />
                      )}
                    </Field>
                    {touched.newPassword && errors.newPassword && (
                      <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                        {errors.newPassword}
                      </Text>
                    )}
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                      Must be at least 8 characters long
                    </Text>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <Text strong style={{ 
                      color: colorScheme.textPrimary,
                      marginBottom: 8,
                      display: 'block'
                    }}>
                      Confirm New Password
                    </Text>
                    <Field name="confirmPassword">
                      {({ field }) => (
                        <Input.Password
                          {...field}
                          size="large"
                          placeholder="Confirm new password"
                          prefix={<LockOutlined style={{ color: colorScheme.textSecondary }} />}
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          status={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                          style={{
                            borderRadius: 6,
                            borderColor: touched.confirmPassword && errors.confirmPassword ? '#ff4d4f' : colorScheme.border
                          }}
                        />
                      )}
                    </Field>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text type="danger" style={{ fontSize: 12, marginTop: 4 }}>
                        {errors.confirmPassword}
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
                    {isLoading || isSubmitting ? <Spin size="small" /> : 'Reset Password'}
                  </Button>

                </Space>
              </Form>
            )}
          </Formik>
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

export default ResetPassword;