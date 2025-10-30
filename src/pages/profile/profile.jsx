import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  message,
  Spin,
  Select,
  DatePicker,
  Switch
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  LockOutlined
} from '@ant-design/icons';
import { updateUser } from '../../store/slices/userSlice';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Get current user from auth slice
  const { user } = useSelector((state) => state.auth);
  const { loading: userLoading } = useSelector((state) => state.user);

 

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
        address: user.address,
        role: user.role,
       
        bio: user.bio
      });
      setImageUrl(user.profilePicture);
    }
  }, [user, form]);

 


  const handleSave = async (values) => {
    setLoading(true);
    try {
      await dispatch(updateUser({ 
        id: user.id, 
        data: {
          ...values,
          dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null
        }
      })).unwrap();
      
      message.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      message.error(`Failed to update profile: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditing(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'purple';
      case 'teacher': return 'blue';
      case 'student': return 'green';
      default: return 'default';
    }
  };

 
  const uploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        // Handle file upload success
        setImageUrl(URL.createObjectURL(info.file.originFileObj));
        message.success('Profile picture updated successfully');
      }
    },
    showUploadList: false,
  };

  if (userLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#090909', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        {/* Left Side - Profile Card */}
        <Col xs={24} lg={8}>
          <Card 
            style={{ 
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px'
            }}
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={imageUrl}
                  icon={<UserOutlined />}
                  style={{ 
                    border: '4px solid #4648fd',
                    background: 'linear-gradient(135deg, #4648fd 0%, #81f9f9 100%)'
                  }}
                />
                {editing && (
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      size="small"
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: '#4648fd',
                        border: '2px solid #121212'
                      }}
                    />
                  </Upload>
                )}
              </div>
              
              <Title level={3} style={{ color: 'white', margin: '16px 0 8px 0' }}>
                {user.name}
              </Title>
              
              <Space size={8} style={{ marginBottom: '16px' }}>
                <Tag color={getRoleColor(user.role)} style={{ textTransform: 'capitalize' }}>
                  {user.role}
                </Tag>
               
              </Space>

              <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                <MailOutlined /> {user.email}
              </Text>
              
              {user.phone && (
                <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '8px' }}>
                  <PhoneOutlined /> {user.phone}
                </Text>
              )}

              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

              {/* Quick Stats */}
              <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
               
                <Col span={24}>
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontSize: '12px' }}>
                      Last Login
                    </Text>
                    <Text style={{ color: '#81f9f9', display: 'block', fontWeight: '600' }}>
                      Today
                    </Text>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Security Card */}
          <Card 
            title={
              <Space>
                <LockOutlined style={{ color: '#4648fd' }} />
                <Text style={{ color: 'white' }}>Security</Text>
              </Space>
            }
            style={{ 
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              marginTop: '24px'
            }}
          >
            <Button 
              type="primary" 
              block 
              style={{
                background: 'transparent',
                border: '1px solid #4648fd',
                color: '#4648fd'
              }}
            >
              Change Password
            </Button>
          </Card>
        </Col>

        {/* Right Side - Edit Form */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <UserOutlined style={{ color: '#4648fd' }} />
                <Text style={{ color: 'white' }}>Profile Information</Text>
              </Space>
            }
            extra={
              !editing ? (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  style={{ background: '#4648fd', borderColor: '#4648fd' }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Space>
                  <Button onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                    loading={loading}
                    style={{ background: '#4648fd', borderColor: '#4648fd' }}
                  >
                    Save Changes
                  </Button>
                </Space>
              )
            }
            style={{ 
              background: '#121212',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px'
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!editing}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Full Name</Text>}
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Email Address</Text>}
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined />}
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Phone Number</Text>}
                  >
                    <Input 
                      prefix={<PhoneOutlined />}
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Date of Birth</Text>}
                  >
                    <DatePicker 
                      style={{ 
                        width: '100%',
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                      suffixIcon={<CalendarOutlined style={{ color: 'rgba(255,255,255,0.5)' }} />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="role"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Role</Text>}
                  >
                    <Select 
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                      disabled
                    >
                      <Option value="admin">Admin</Option>
                      <Option value="teacher">Teacher</Option>
                      <Option value="student">Student</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="isActive"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Status</Text>}
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Active" 
                      unCheckedChildren="Inactive"
                      style={{ background: user.isActive ? '#4648fd' : '#ccc' }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="address"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Address</Text>}
                  >
                    <Input 
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="bio"
                    label={<Text style={{ color: 'rgba(255,255,255,0.8)' }}>Bio</Text>}
                  >
                    <TextArea 
                      rows={4}
                      placeholder="Tell us about yourself..."
                      style={{ 
                        background: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        resize: 'none'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;