import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Alert,
  message,
  Spin,
  Space,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;


const ChangePasswordScreen = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onFinish = async (values:any) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    
    if (newPassword !== confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: ['Passwords do not match'],
        },
      ]);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const id = localStorage.getItem('id');
      const token = localStorage.getItem('token');

      if (!id || !token) {
        setError('Session expired. Please login again');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/stationAdmins/${id}/changePassword`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        localStorage.setItem('mustChangePassword', 'false');
        setSuccess(true);
        message.success('Password updated successfully!', 2, () => navigate('/StationsAdminDashboard'));
      }
    } catch (err: unknown) {
      let message = 'Failed to update password';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;

        if (err.response?.status === 401) {
          form.setFields([
            {
              name: 'currentPassword',
              errors: ['Current password is incorrect'],
            },
          ]);
        } else {
          setError(message);
        }
      } else {
        setError(message);
      }

      console.error('Change Password Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="container mx-auto max-w-lg">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-blue-50"
          size="large"
        >
          Back
        </Button>

        <Card
          className="shadow-xl border-0"
          styles={{
            body: {
              padding: '32px'
            }
          }}
        >
          <Space direction="vertical" size="large" className="w-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <LockOutlined className="text-2xl text-blue-600" />
                </div>
              </div>
              <Title level={2} className="!mb-2 text-blue-600">
                Change Password
              </Title>
              <Text type="secondary" className="text-gray-500">
                Enter your details to update your password
              </Text>
            </div>

            <Divider className="my-2" />

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError('')}
                className="mb-4"
              />
            )}

            {success && (
              <Alert
                message="Success"
                description="Password updated successfully!"
                type="success"
                showIcon
                className="mb-4"
              />
            )}

            <Form
              form={form}
              name="changePassword"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  { required: true, message: 'Please enter current password' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-300" />}
                  placeholder="Enter current password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Must include uppercase, lowercase, number & special character',
                  },
                ]}
                help="Minimum 8 characters with uppercase, lowercase, number and special character"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-300" />}
                  placeholder="Enter new password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-300" />}
                  placeholder="Confirm new password"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 border-0 font-semibold h-12"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <Text>Ensure your new password is strong and unique.</Text>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;