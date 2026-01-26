import {
  Modal,
  Input,
  Button,
  message,
  Select,
  Form,
  Card,
  Space,
  Typography,
  Alert,
  Row,
  Col,
  Tag,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaUserEdit,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRoute,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const { Title, Text } = Typography;

type Dispatcher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Routes: string;
};

type Route = {
  id: number;
  station_name: string;
  EndTerminal: string;
};

type EditDispachersModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  Dispacher: Dispatcher | null;
  onUpdated: (updatedDispatcher: Dispatcher) => void;
};

const EditDispachersModal: React.FC<EditDispachersModalProps> = ({
  isOpen,
  handleCancel,
  Dispacher,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalData, setOriginalData] = useState<Dispatcher | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameCheckTimer, setUsernameCheckTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const token = localStorage.getItem('token');

  const fetchRoutes = async () => {
    if (!token) {
      message.error('No token found. Please login again.');
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/routes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedRoutes = res.data.map((route: any) => ({
        id: route.id,
        station_name:
          route.station_name || route.StartTerminal || 'Main Station',
        EndTerminal: route.EndTerminal || 'Unknown Destination',
        ...route,
      }));

      setRoutes(mappedRoutes);
    } catch (err: any) {
      console.error('Failed to fetch routes:', err);
      message.error(err.response?.data?.message || 'Failed to fetch routes');
    }
  };

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username.trim() || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (!token) return;
      if (
        originalData &&
        username.trim().toLowerCase() === originalData.UserName.toLowerCase()
      ) {
        setIsUsernameAvailable(true);
        return;
      }

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
            dispatcher.UserName.toLowerCase() ===
              username.trim().toLowerCase() &&
            dispatcher.id !== originalData?.id
        );

        setIsUsernameAvailable(!usernameExists);
      } catch (err: any) {
        console.error('Failed to check username:', err);
        setIsUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    },
    [token, originalData]
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
    if (isOpen) {
      fetchRoutes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && Dispacher) {
      setFullName(Dispacher.FullName);
      setEmail(Dispacher.Email);
      setPhoneNumber(String(Dispacher.PhoneNumber));
      setUserName(Dispacher.UserName);
      setSelectedRoute(Dispacher.Routes);
      setOriginalData(Dispacher);
      setIsUsernameAvailable(true);

      form.setFieldsValue({
        FullName: Dispacher.FullName,
        Email: Dispacher.Email,
        PhoneNumber: String(Dispacher.PhoneNumber),
        UserName: Dispacher.UserName,
        Routes: Dispacher.Routes,
      });
    }
  }, [isOpen, Dispacher, form]);

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
      /^09\d{8}$/.test(phoneNumber.replace(/\s/g, '')) &&
      userName.trim().length >= 3 &&
      (isUsernameAvailable === true ||
        (originalData &&
          userName.trim().toLowerCase() ===
            originalData.UserName.toLowerCase()));

    setIsFormValid(!!isValid);
  }, [
    fullName,
    email,
    phoneNumber,
    userName,
    selectedRoute,
    isUsernameAvailable,
    originalData,
  ]);

  const hasChanges = () => {
    if (!originalData) return false;
    return (
      fullName !== originalData.FullName ||
      email !== originalData.Email ||
      phoneNumber !== String(originalData.PhoneNumber) ||
      userName !== originalData.UserName ||
      selectedRoute !== originalData.Routes
    );
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      message.warning("Please enter the dispatcher's full name");
      return;
    }

    if (!/^[A-Za-z\s'-]+$/.test(fullName.trim())) {
      message.warning(
        'Name can only contain letters, spaces, apostrophes, and hyphens'
      );
      return;
    }

    if (fullName.trim().length < 2) {
      message.warning('Name should be at least 2 characters long');
      return;
    }

    if (!email) {
      message.warning('Please enter a valid email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.warning('Please enter a valid email address format');
      return;
    }

    if (!phoneNumber) {
      message.warning('Please enter a phone number');
      return;
    }

    const cleanedPhone = phoneNumber.replace(/\s/g, '');
    if (!/^09\d{8}$/.test(cleanedPhone)) {
      message.warning(
        'Please enter a valid Ethiopian phone number (09XXXXXXXX)'
      );
      return;
    }

    if (!userName) {
      message.warning('Please enter a username');
      return;
    }

    if (userName.trim().length < 3) {
      message.warning('Username must be at least 3 characters');
      return;
    }

    if (
      !originalData ||
      userName.trim().toLowerCase() !== originalData.UserName.toLowerCase()
    ) {
      if (isUsernameAvailable === false) {
        message.warning(
          'This username is already taken. Please choose another one.'
        );
        return;
      }

      if (isUsernameAvailable === null && checkingUsername) {
        message.warning('Please wait while we check username availability');
        return;
      }
    }

    if (!selectedRoute) {
      message.warning('Please select an assigned route');
      return;
    }

    if (!hasChanges()) {
      message.info('No changes detected');
      return;
    }

    if (!token) {
      message.error('No token found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/dispachers/${Dispacher?.id}`,
        {
          FullName: fullName.trim(),
          Email: email.trim().toLowerCase(),
          PhoneNumber: cleanedPhone,
          UserName: userName.trim(),
          Routes: selectedRoute,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success({
        content: res.data.message || 'Dispatcher updated successfully!',
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      const updatedDispatcher = {
        ...Dispacher!,
        FullName: fullName.trim(),
        Email: email.trim().toLowerCase(),
        PhoneNumber: cleanedPhone,
        UserName: userName.trim(),
        Routes: selectedRoute,
      };

      onUpdated(updatedDispatcher);
      handleCancel();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update dispatcher';
      message.error({
        content: errorMessage.includes('Duplicate')
          ? 'Username or email already exists'
          : errorMessage,
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedRoute('');
      setIsUsernameAvailable(null);
      form.resetFields();

      if (usernameCheckTimer) {
        clearTimeout(usernameCheckTimer);
        setUsernameCheckTimer(null);
      }
    }
  }, [isOpen, form]);

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
    if (
      originalData &&
      userName.trim().toLowerCase() === originalData.UserName.toLowerCase()
    ) {
      return 'Current username (no change)';
    }
    if (isUsernameAvailable === false) return 'Username already taken';
    if (isUsernameAvailable === true) return 'Username is available';
    return 'Username must be at least 3 characters';
  };

  return (
    <Modal
      open={isOpen}
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
            <FaUserEdit size={18} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Edit Dispatcher
          </Title>
          {Dispacher && (
            <Tag color="blue" style={{ marginLeft: 8, fontSize: '11px' }}>
              ID: {Dispacher.id}
            </Tag>
          )}
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
          message="Update Dispatcher Information"
          description={
            Dispacher
              ? `Editing ${Dispacher.FullName}'s details`
              : 'Loading dispatcher information...'
          }
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
                  {hasChanges() && (
                    <Tag
                      color="orange"
                      style={{ marginLeft: 'auto', fontSize: '11px' }}
                    >
                      Unsaved Changes
                    </Tag>
                  )}
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
                    ? /^09\d{8}$/.test(phoneNumber.replace(/\s/g, ''))
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '12px' }}>
                    {phoneNumber
                      ? !/^09\d{8}$/.test(phoneNumber.replace(/\s/g, ''))
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
                  <MdDriveFileRenameOutline
                    style={{ color: '#1890ff', fontSize: '14px' }}
                  />
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
                    {isUsernameAvailable === true &&
                      originalData &&
                      userName.trim().toLowerCase() !==
                        originalData.UserName.toLowerCase() && (
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
                    {originalData &&
                      userName.trim().toLowerCase() ===
                        originalData.UserName.toLowerCase() && (
                        <Tag
                          color="blue"
                          style={{
                            marginLeft: 8,
                            fontSize: '10px',
                            padding: '0 4px',
                          }}
                        >
                          Current
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
                  placeholder="Select a route"
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
                  suffixIcon={
                    <FaRoute style={{ color: '#bfbfbf', fontSize: '12px' }} />
                  }
                  options={routeOptions}
                  loading={routes.length === 0}
                  listHeight={200}
                />
              </Form.Item>

              {hasChanges() && originalData && (
                <Card
                  size="small"
                  style={{
                    marginBottom: 16,
                    borderColor: '#d6e4ff',
                    backgroundColor: '#f0f7ff',
                  }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <Space
                    direction="vertical"
                    size={6}
                    style={{ width: '100%' }}
                  >
                    <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                      Changes Summary
                    </Text>

                    {fullName !== originalData.FullName && (
                      <div>
                        <Text
                          type="secondary"
                          style={{ fontSize: '11px', marginRight: 4 }}
                        >
                          Name:
                        </Text>
                        <Text
                          style={{
                            fontSize: '11px',
                            textDecoration: 'line-through',
                            color: '#ff4d4f',
                            marginRight: 4,
                          }}
                        >
                          {originalData.FullName}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {fullName}
                        </Text>
                      </div>
                    )}

                    {phoneNumber !== String(originalData.PhoneNumber) && (
                      <div>
                        <Text
                          type="secondary"
                          style={{ fontSize: '11px', marginRight: 4 }}
                        >
                          Phone:
                        </Text>
                        <Text
                          style={{
                            fontSize: '11px',
                            textDecoration: 'line-through',
                            color: '#ff4d4f',
                            marginRight: 4,
                          }}
                        >
                          {originalData.PhoneNumber}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {phoneNumber}
                        </Text>
                      </div>
                    )}

                    {userName !== originalData.UserName && (
                      <div>
                        <Text
                          type="secondary"
                          style={{ fontSize: '11px', marginRight: 4 }}
                        >
                          Username:
                        </Text>
                        <Text
                          style={{
                            fontSize: '11px',
                            textDecoration: 'line-through',
                            color: '#ff4d4f',
                            marginRight: 4,
                          }}
                        >
                          {originalData.UserName}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {userName}
                        </Text>
                      </div>
                    )}

                    {selectedRoute !== originalData.Routes && (
                      <div>
                        <Text
                          type="secondary"
                          style={{ fontSize: '11px', marginRight: 4 }}
                        >
                          Route:
                        </Text>
                        <Text
                          style={{
                            fontSize: '11px',
                            textDecoration: 'line-through',
                            color: '#ff4d4f',
                            marginRight: 4,
                          }}
                        >
                          {originalData.Routes}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {selectedRoute}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              )}

              {isFormValid && hasChanges() && (
                <Alert
                  message="Ready to Update"
                  description={
                    <div style={{ fontSize: '12px' }}>
                      <div>
                        <strong>Name:</strong> {fullName}
                      </div>
                      <div>
                        <strong>Username:</strong> {userName}
                        {originalData &&
                          userName.trim().toLowerCase() !==
                            originalData.UserName.toLowerCase() && (
                            <Tag
                              color="green"
                              style={{ marginLeft: 4, fontSize: '10px' }}
                            >
                              ✓
                            </Tag>
                          )}
                      </div>
                      <div>
                        <strong>Route:</strong> {selectedRoute}
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{
                    marginBottom: 16,
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                />
              )}

              <div
                style={{
                  marginTop: 16,
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
                    onClick={handleUpdate}
                    size="middle"
                    disabled={!isFormValid || !hasChanges()}
                    style={{
                      borderRadius: '5px',
                      padding: '0 24px',
                      fontSize: '13px',
                      background:
                        isFormValid && hasChanges() ? '#1890ff' : '#d9d9d9',
                      borderColor:
                        isFormValid && hasChanges() ? '#1890ff' : '#d9d9d9',
                    }}
                    icon={<FaUserEdit style={{ fontSize: '12px' }} />}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </Space>

                <div style={{ marginTop: 12 }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    <FaExclamationCircle
                      style={{ marginRight: '4px', fontSize: '10px' }}
                    />
                    Username must be unique
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

export default EditDispachersModal;
