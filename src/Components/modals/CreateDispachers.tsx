import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Form,
  Card,
  Space,
  Typography,
  Tag,
  Alert,
  Row,
  Col,
} from 'antd';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import {
  FaUserPlus,
  FaRoute,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaExclamationCircle,
} from 'react-icons/fa';

const { Title, Text } = Typography;

type CreateDispachersProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onDispachersCreated?: () => void;
};

type Route = {
  id: number;
  station_name: string;
  EndTerminal: string;
};

const CreateDispachers: React.FC<CreateDispachersProps> = ({
  isModalOpen,
  handleCancel,
  onDispachersCreated,
}) => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameCheckTimer, setUsernameCheckTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/routes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mappedRoutes = res.data.map((route: any) => ({
          id: route.id,
          station_name: route.station_name,
          EndTerminal: route.EndTerminal || 'Unknown Destination',
          ...route,
        }));

        setRoutes(mappedRoutes);
      } catch (err: any) {
        console.error('Failed to fetch routes:', err);
        message.error(err.response?.data?.message || 'Failed to fetch routes');
      }
    };

    if (isModalOpen) {
      fetchRoutes();
    }
  }, [isModalOpen, token]);

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username.trim() || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (!token) return;

      setCheckingUsername(true);
      try {
        const res = await axios.get('http://localhost:5000/dispachers', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: username.trim() },
        });
        const dispatchers = res.data || [];
        const usernameExists = dispatchers.some(
          (dispatcher: any) =>
            dispatcher.UserName &&
            dispatcher.UserName.toLowerCase() === username.trim().toLowerCase()
        );

        setIsUsernameAvailable(!usernameExists);
      } catch (err: any) {
        console.error('Failed to check username:', err);
        setIsUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    },
    [token]
  );

  const handleUsernameChange = (value: string) => {
    setUserName(value);
    if (usernameCheckTimer) {
      clearTimeout(usernameCheckTimer);
    }

    const timer = setTimeout(() => {
      if (value.trim().length >= 3) {
        checkUsernameAvailability(value);
      } else {
        setIsUsernameAvailable(null);
      }
    }, 500);

    setUsernameCheckTimer(timer);
  };

  useEffect(() => {
    const isValid =
      fullName &&
      email &&
      phoneNumber &&
      userName &&
      selectedRoute &&
      fullName.trim().length >= 2 &&
      /^[A-Za-z\s'-]+$/.test(fullName.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^09\d{8}$/.test(phoneNumber) &&
      userName.trim().length >= 3 &&
      isUsernameAvailable === true;
    setIsFormValid(!!isValid);
  }, [
    fullName,
    email,
    phoneNumber,
    userName,
    selectedRoute,
    isUsernameAvailable,
  ]);

  const handleCreate = async () => {
    if (!isFormValid) {
      message.warning('Please fill all required fields correctly');
      return;
    }

    if (isUsernameAvailable === false) {
      message.warning(
        'This username is already taken. Please choose another one.'
      );
      return;
    }

    if (!token) {
      message.error('No token found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/dispachers',
        {
          FullName: fullName.trim(),
          Email: email.trim().toLowerCase(),
          PhoneNumber: phoneNumber,
          UserName: userName.trim(),
          Routes: selectedRoute,
          role_id: 3,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success({
        content: res.data.message || '✅ Dispatcher created successfully!',
        duration: 3,
      });

      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedRoute(undefined);
      setIsUsernameAvailable(null);
      form.resetFields();

      handleCancel();
      onDispachersCreated?.();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Failed to create dispatcher';
      message.error({
        content:
          errorMessage.includes('Duplicate') ||
          errorMessage.includes('username')
            ? 'Username or email already exists'
            : errorMessage,
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedRoute(undefined);
      setIsUsernameAvailable(null);
      form.resetFields();

      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
        setUsernameCheckTimer(null);
      }
    }
  }, [isModalOpen, form]);

  useEffect(() => {
    return () => {
      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
      }
    };
  }, []);

  const routeOptions = routes.map((route) => ({
    label: (
      <Space>
        <FaRoute style={{ color: '#1890ff' }} />
        <Text style={{ fontSize: '13px' }}>
          {route.station_name} → {route.EndTerminal}
        </Text>
      </Space>
    ),
    value: `${route.station_name} → ${route.EndTerminal}`,
  }));

  const getUsernameValidationStatus = () => {
    if (!userName) return '';
    if (userName.trim().length < 3) return 'error';
    if (checkingUsername) return 'validating';
    if (isUsernameAvailable === false) return 'error';
    if (isUsernameAvailable === true) return 'success';
    return '';
  };

  const getUsernameHelpText = () => {
    if (!userName) return 'Choose a username';
    if (userName.trim().length < 3) return 'Minimum 3 characters';
    if (checkingUsername) return 'Checking availability...';
    if (isUsernameAvailable === false) return 'Username already taken';
    if (isUsernameAvailable === true) return 'Username is available';
    return 'Username must be at least 3 characters';
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      style={{ top: 20 }}
      title={
        <Space align="center">
          <div
            style={{
              backgroundColor: '#1890ff',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaUserPlus size={18} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Create New Dispatcher
          </Title>
        </Space>
      }
      styles={{
        body: { padding: '16px 0' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' },
        content: { maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' },
      }}
    >
      <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
        <Alert
          message="Dispatcher Information"
          description="Fill all required fields to create a new dispatcher account"
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{
            marginBottom: 20,
            borderRadius: '6px',
            fontSize: '13px',
          }}
        />

        <Row gutter={[20, 16]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FaUser style={{ color: '#1890ff', fontSize: '14px' }} />
                  <Text strong style={{ fontSize: '14px' }}>
                    Personal Details
                  </Text>
                </Space>
              }
              size="small"
              style={{
                borderColor: '#e8e8e8',
                height: '100%',
              }}
              bodyStyle={{ padding: '16px' }}
              headStyle={{
                padding: '0 16px',
                minHeight: 'auto',
                lineHeight: '40px',
              }}
            >
              <Form.Item
                label={
                  <Space size={4}>
                    <FaUser
                      size={11}
                      style={{ color: '#1890ff', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Full Name
                    </Text>
                    <Tag
                      color="red"
                      style={{ fontSize: '9px', padding: '0 4px' }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={
                  fullName
                    ? /^[A-Za-z\s'-]+$/.test(fullName.trim()) &&
                      fullName.trim().length >= 2
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '12px' }}>
                    {fullName
                      ? !/^[A-Za-z\s'-]+$/.test(fullName.trim())
                        ? 'Only letters, spaces, apostrophes, and hyphens'
                        : fullName.trim().length < 2
                        ? 'Minimum 2 characters'
                        : ''
                      : "Dispatcher's full name"}
                  </div>
                }
              >
                <Input
                  placeholder="e.g., Abebe Kebede"
                  value={fullName}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(
                      /[^A-Za-z\s'-]/g,
                      ''
                    );
                    setFullName(filtered);
                  }}
                  onBlur={() => {
                    if (fullName.trim()) {
                      const capitalized = fullName
                        .trim()
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(' ');
                      setFullName(capitalized);
                    }
                  }}
                  size="middle"
                  prefix={
                    <FaUser style={{ color: '#bfbfbf', fontSize: '12px' }} />
                  }
                  style={{ borderRadius: '5px', fontSize: '13px' }}
                  allowClear
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space size={4}>
                    <FaEnvelope
                      size={11}
                      style={{ color: '#1890ff', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Email Address
                    </Text>
                    <Tag
                      color="red"
                      style={{ fontSize: '9px', padding: '0 4px' }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={
                  email
                    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '12px' }}>
                    {email
                      ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? 'Invalid email format'
                        : ''
                      : 'Valid email address'}
                  </div>
                }
              >
                <Input
                  placeholder="abebe.kebede@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  size="middle"
                  prefix={
                    <FaEnvelope
                      style={{ color: '#bfbfbf', fontSize: '12px' }}
                    />
                  }
                  style={{ borderRadius: '5px', fontSize: '13px' }}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space size={4}>
                    <FaPhoneAlt
                      size={11}
                      style={{ color: '#1890ff', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Phone Number
                    </Text>
                    <Tag
                      color="red"
                      style={{ fontSize: '9px', padding: '0 4px' }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={
                  phoneNumber
                    ? /^09\d{8}$/.test(phoneNumber)
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '12px' }}>
                    {phoneNumber
                      ? !/^09\d{8}$/.test(phoneNumber)
                        ? 'Format: 09XXXXXXXX'
                        : ''
                      : 'Ethiopian phone number'}
                  </div>
                }
              >
                <Input
                  placeholder="0912345678"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  size="middle"
                  prefix={
                    <FaPhoneAlt
                      style={{ color: '#bfbfbf', fontSize: '12px' }}
                    />
                  }
                  style={{ borderRadius: '5px', fontSize: '13px' }}
                  allowClear
                  maxLength={10}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FaUserPlus style={{ color: '#1890ff', fontSize: '14px' }} />
                  <Text strong style={{ fontSize: '14px' }}>
                    Account & Route
                  </Text>
                </Space>
              }
              size="small"
              style={{
                borderColor: '#e8e8e8',
                height: '100%',
                marginBottom: 0,
              }}
              bodyStyle={{ padding: '16px' }}
              headStyle={{
                padding: '0 16px',
                minHeight: 'auto',
                lineHeight: '40px',
              }}
            >
              <Form.Item
                label={
                  <Space size={4}>
                    <FaUser
                      size={11}
                      style={{ color: '#1890ff', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Username
                    </Text>
                    <Tag
                      color="red"
                      style={{ fontSize: '9px', padding: '0 4px' }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={getUsernameValidationStatus()}
                help={
                  <div style={{ fontSize: '12px' }}>
                    {getUsernameHelpText()}
                    {isUsernameAvailable === true && (
                      <Tag
                        color="green"
                        style={{
                          marginLeft: 8,
                          fontSize: '10px',
                          padding: '0 4px',
                        }}
                      >
                        Available
                      </Tag>
                    )}
                    {isUsernameAvailable === false && (
                      <Tag
                        color="red"
                        style={{
                          marginLeft: 8,
                          fontSize: '10px',
                          padding: '0 4px',
                        }}
                      >
                        Taken
                      </Tag>
                    )}
                  </div>
                }
              >
                <Input
                  placeholder="abebe123"
                  value={userName}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  size="middle"
                  prefix={
                    <FaUser style={{ color: '#bfbfbf', fontSize: '12px' }} />
                  }
                  style={{ borderRadius: '5px', fontSize: '13px' }}
                  allowClear
                  maxLength={30}
                  disabled={checkingUsername}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space size={4}>
                    <FaRoute
                      size={11}
                      style={{ color: '#1890ff', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Assigned Route
                    </Text>
                    <Tag
                      color="red"
                      style={{ fontSize: '9px', padding: '0 4px' }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={selectedRoute ? 'success' : ''}
                help={
                  <div style={{ fontSize: '12px' }}>
                    {!selectedRoute ? 'Select a route for the dispatcher' : ''}
                  </div>
                }
              >
                <Select
                  placeholder="Select a route for assignment"
                  value={selectedRoute}
                  onChange={setSelectedRoute}
                  size="middle"
                  style={{
                    width: '100%',
                    borderRadius: '5px',
                    fontSize: '13px',
                  }}
                  dropdownStyle={{
                    borderRadius: '5px',
                    maxHeight: 250,
                    overflow: 'auto',
                  }}
                  allowClear
                  suffixIcon={
                    <FaRoute style={{ color: '#bfbfbf', fontSize: '12px' }} />
                  }
                  options={routeOptions}
                  loading={routes.length === 0}
                  listHeight={200}
                />
              </Form.Item>

              {isFormValid && (
                <Alert
                  message="Ready to Create"
                  description={
                    <div style={{ fontSize: '12px' }}>
                      <div>
                        <strong>Name:</strong> {fullName}
                      </div>
                      <div>
                        <strong>Username:</strong>{' '}
                        <Tag color="green" style={{ fontSize: '10px' }}>
                          {userName}
                        </Tag>
                      </div>
                      <div>
                        <strong>Route:</strong> {selectedRoute}
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{
                    marginTop: 16,
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                />
              )}

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleCancel}
                    size="middle"
                    style={{
                      borderRadius: '5px',
                      padding: '0 20px',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    loading={loading}
                    onClick={handleCreate}
                    size="middle"
                    disabled={!isFormValid}
                    style={{
                      borderRadius: '5px',
                      padding: '0 24px',
                      fontSize: '13px',
                      background: isFormValid ? '#1890ff' : '#d9d9d9',
                      borderColor: isFormValid ? '#1890ff' : '#d9d9d9',
                    }}
                    icon={<FaUserPlus style={{ fontSize: '12px' }} />}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
                </Space>

                <div style={{ marginTop: 12 }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    <FaExclamationCircle
                      style={{ marginRight: '4px', fontSize: '10px' }}
                    />
                    All fields are required. Username must be unique.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateDispachers;
