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
  Radio,
} from 'antd';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaBuilding,
  FaExclamationCircle,
  FaCheckCircle,
  FaRoute,
  FaUserPlus,
} from 'react-icons/fa';

import {
  MdAdminPanelSettings,
  MdDirectionsBus,
  MdPerson,
} from 'react-icons/md';

const { Title, Text } = Typography;

type CreateUserModalProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onUserCreated?: () => void;
};

type Station = {
  StationName: string;
};

type Route = {
  id: number;
  station_name: string;
  EndTerminal: string;
};

type UserRole = 'Station Admin' | 'Dispatcher';

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isModalOpen,
  handleCancel,
  onUserCreated,
}) => {
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState<UserRole>('Station Admin');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
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
    const fetchData = async () => {
      if (isModalOpen) {
        setFetchingData(true);
        try {
          const stationsRes = await axios.get('http://localhost:5000/stations');
          setStations(stationsRes.data);

          const routesRes = await axios.get(
            'http://localhost:5000/routes/forAdmin'
          );
          const mappedRoutes = routesRes.data.map((route: any) => ({
            id: route.id,
            station_name: route.station_name,
            EndTerminal: route.EndTerminal || 'Unknown Destination',
            ...route,
          }));
          setRoutes(mappedRoutes);
        } catch (err: any) {
          console.error('Failed to fetch data:', err);
          message.error(err.response?.data?.message || 'Failed to load data');
        } finally {
          setFetchingData(false);
        }
      }
    };

    fetchData();
  }, [isModalOpen]);

  const checkUsernameAvailability = useCallback(
    async (username: string, role: UserRole) => {
      if (!username.trim() || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (!token) {
        message.error('No authentication token found');
        return;
      }

      setCheckingUsername(true);
      try {
        const endpoint =
          role === 'Station Admin'
            ? 'http://localhost:5000/stationadmins'
            : 'http://localhost:5000/dispachers/forAdmin';

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = res.data || [];
        const usernameExists = users.some(
          (user: any) =>
            user.UserName &&
            user.UserName.toLowerCase() === username.trim().toLowerCase()
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
        checkUsernameAvailability(value, userRole);
      } else {
        setIsUsernameAvailable(null);
      }
    }, 500);

    setUsernameCheckTimer(timer);
  };

  useEffect(() => {
    const hasAssignment =
      userRole === 'Station Admin' ? selectedStation : selectedRoute;

    const isValid =
      fullName &&
      email &&
      phoneNumber &&
      userName &&
      hasAssignment &&
      fullName.trim().length >= 2 &&
      /^[A-Za-z\s'-]+$/.test(fullName.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      (/^09\d{8}$/.test(phoneNumber.replace(/\s/g, '')) ||
        /^\+2519\d{9}$/.test(phoneNumber.replace(/\s/g, ''))) &&
      userName.trim().length >= 3 &&
      isUsernameAvailable === true;

    setIsFormValid(!!isValid);
  }, [
    fullName,
    email,
    phoneNumber,
    userName,
    selectedStation,
    selectedRoute,
    isUsernameAvailable,
    userRole,
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
      const endpoint =
        userRole === 'Station Admin'
          ? 'http://localhost:5000/stationadmins'
          : 'http://localhost:5000/dispachers';

      const payload = {
        FullName: fullName.trim(),
        Email: email.trim().toLowerCase(),
        PhoneNumber: phoneNumber.replace(/\s/g, ''),
        UserName: userName.trim(),
        role_id: userRole === 'Station Admin' ? 2 : 3,
      };

      if (userRole === 'Station Admin') {
        (payload as any).selectedStation = selectedStation;
        (payload as any).Stations = selectedStation;
      } else {
        (payload as any).Routes = selectedRoute;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: userRole === 'Station Admin', // Keep withCredentials for station admin
      };

      const res = await axios.post(endpoint, payload, config);

      message.success({
        content: res.data.message || ` ${userRole} created successfully!`,
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedStation(undefined);
      setSelectedRoute(undefined);
      setIsUsernameAvailable(null);
      form.resetFields();

      handleCancel();
      onUserCreated?.();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || `Failed to create ${userRole}`;
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
      setSelectedStation(undefined);
      setSelectedRoute(undefined);
      setIsUsernameAvailable(null);
      setUserRole('Station Admin');
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

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('09') && cleaned.length <= 10) {
      return cleaned;
    } else if (cleaned.startsWith('+2519') && cleaned.length <= 13) {
      return cleaned;
    } else if (cleaned.startsWith('2519') && cleaned.length <= 12) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('9') && cleaned.length <= 9) {
      return `0${cleaned}`;
    }

    return cleaned;
  };

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

  const stationOptions = stations.map((station) => ({
    label: (
      <Space>
        <FaBuilding style={{ color: '#722ed1', fontSize: '12px' }} />
        <Text style={{ fontSize: '13px' }}>{station.StationName}</Text>
      </Space>
    ),
    value: station.StationName,
  }));

  // Route options
  const routeOptions = routes.map((route) => ({
    label: (
      <Space>
        <FaRoute style={{ color: '#1890ff', fontSize: '12px' }} />
        <Text style={{ fontSize: '13px' }}>
          {route.station_name} → {route.EndTerminal}
        </Text>
      </Space>
    ),
    value: `${route.station_name} → ${route.EndTerminal}`,
  }));

  const getRoleColor = () => {
    return userRole === 'Station Admin' ? '#722ed1' : '#1890ff';
  };

  const getRoleIcon = () => {
    return userRole === 'Station Admin' ? (
      <MdAdminPanelSettings size={16} color="#fff" />
    ) : (
      <FaUserPlus size={16} color="#fff" />
    );
  };

  const getRoleTitle = () => {
    return userRole === 'Station Admin' ? 'Station Admin' : 'Dispatcher';
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
              backgroundColor: getRoleColor(),
              borderRadius: '6px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getRoleIcon()}
          </div>
          <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
            Create New {getRoleTitle()}
          </Title>
        </Space>
      }
      styles={{
        body: { padding: '12px 0' },
        header: {
          borderBottom: '1px solid #f0f0f0',
          padding: '12px 20px',
          marginBottom: 0,
        },
        content: {
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          padding: '0 20px',
        },
      }}
    >
      <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
        <Alert
          message={`${getRoleTitle()} Information`}
          description={`Fill all required fields to create a new ${getRoleTitle().toLowerCase()} account`}
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{
            marginBottom: 16,
            borderRadius: '6px',
            fontSize: '12px',
          }}
        />

        {/* Role Selection */}
        <Card
          size="small"
          style={{
            borderColor: '#e8e8e8',
            marginBottom: 16,
          }}
          bodyStyle={{ padding: '12px' }}
        >
          <Form.Item
            label={
              <Space size={4} align="center">
                <MdPerson style={{ color: getRoleColor(), fontSize: '13px' }} />
                <Text strong style={{ fontSize: '12px', lineHeight: '16px' }}>
                  User Role
                </Text>
                <Tag
                  color="red"
                  style={{
                    fontSize: '8px',
                    padding: '0 3px',
                    height: '16px',
                    lineHeight: '14px',
                    marginTop: '1px',
                  }}
                >
                  Required
                </Tag>
              </Space>
            }
            required={false}
          >
            <Radio.Group
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                setIsUsernameAvailable(null);
                setSelectedStation(undefined);
                setSelectedRoute(undefined);
              }}
              buttonStyle="solid"
              style={{ width: '100%', display: 'flex' }}
            >
              <Radio.Button
                value="Station Admin"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '12px',
                  padding: '6px 8px',
                  height: '32px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor:
                    userRole === 'Station Admin' ? '#722ed1' : '#d9d9d9',
                  color: userRole === 'Station Admin' ? '#722ed1' : undefined,
                }}
              >
                Station Admin
              </Radio.Button>
              <Radio.Button
                value="Dispatcher"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '12px',
                  padding: '6px 8px',
                  height: '32px',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor:
                    userRole === 'Dispatcher' ? '#1890ff' : '#d9d9d9',
                  color: userRole === 'Dispatcher' ? '#1890ff' : undefined,
                }}
              >
                Dispatcher
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FaUser style={{ color: getRoleColor(), fontSize: '13px' }} />
                  <Text strong style={{ fontSize: '13px' }}>
                    Personal Details
                  </Text>
                </Space>
              }
              size="small"
              style={{
                borderColor: '#e8e8e8',
                height: '100%',
              }}
              bodyStyle={{ padding: '12px' }}
              headStyle={{
                padding: '0 12px',
                minHeight: 'auto',
                lineHeight: '32px',
              }}
            >
              <Form.Item
                label={
                  <Space size={4}>
                    <FaUser
                      size={10}
                      style={{ color: getRoleColor(), fontSize: '12px' }}
                    />
                    <Text strong style={{ fontSize: '12px' }}>
                      Full Name
                    </Text>
                    <Tag
                      color="red"
                      style={{
                        fontSize: '8px',
                        padding: '0 3px',
                        height: '16px',
                      }}
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
                  <div style={{ fontSize: '11px', marginTop: 2 }}>
                    {fullName
                      ? !/^[A-Za-z\s'-]+$/.test(fullName.trim())
                        ? 'Only letters, spaces, apostrophes, and hyphens'
                        : fullName.trim().length < 2
                          ? 'Minimum 2 characters'
                          : ''
                      : "User's full name"}
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
                    <FaUser style={{ color: '#bfbfbf', fontSize: '11px' }} />
                  }
                  style={{
                    borderRadius: '4px',
                    fontSize: '12px',
                    padding: '4px 11px',
                  }}
                  allowClear
                  maxLength={50}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space size={4}>
                    <FaEnvelope
                      size={10}
                      style={{ color: getRoleColor(), fontSize: '12px' }}
                    />
                    <Text strong style={{ fontSize: '12px' }}>
                      Email Address
                    </Text>
                    <Tag
                      color="red"
                      style={{
                        fontSize: '8px',
                        padding: '0 3px',
                        height: '16px',
                      }}
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
                  <div style={{ fontSize: '11px', marginTop: 2 }}>
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
                      style={{ color: '#bfbfbf', fontSize: '11px' }}
                    />
                  }
                  style={{
                    borderRadius: '4px',
                    fontSize: '12px',
                    padding: '4px 11px',
                  }}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space size={4}>
                    <FaPhoneAlt
                      size={10}
                      style={{ color: getRoleColor(), fontSize: '12px' }}
                    />
                    <Text strong style={{ fontSize: '12px' }}>
                      Phone Number
                    </Text>
                    <Tag
                      color="red"
                      style={{
                        fontSize: '8px',
                        padding: '0 3px',
                        height: '16px',
                      }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={
                  phoneNumber
                    ? /^09\d{8}$/.test(phoneNumber.replace(/\s/g, '')) ||
                      /^\+2519\d{9}$/.test(phoneNumber.replace(/\s/g, ''))
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '11px', marginTop: 2 }}>
                    {phoneNumber
                      ? !/^09\d{8}$/.test(phoneNumber.replace(/\s/g, '')) &&
                        !/^\+2519\d{9}$/.test(phoneNumber.replace(/\s/g, ''))
                        ? 'Format: 09XXXXXXXX or +2519XXXXXXXXX'
                        : ''
                      : 'Ethiopian phone number'}
                  </div>
                }
              >
                <Input
                  placeholder="0912345678 or +251912345678"
                  value={phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
                  }}
                  size="middle"
                  prefix={
                    <FaPhoneAlt
                      style={{ color: '#bfbfbf', fontSize: '11px' }}
                    />
                  }
                  style={{
                    borderRadius: '4px',
                    fontSize: '12px',
                    padding: '4px 11px',
                  }}
                  allowClear
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  {userRole === 'Station Admin' ? (
                    <MdAdminPanelSettings
                      style={{ color: getRoleColor(), fontSize: '13px' }}
                    />
                  ) : (
                    <FaUserPlus
                      style={{ color: getRoleColor(), fontSize: '13px' }}
                    />
                  )}
                  <Text strong style={{ fontSize: '13px' }}>
                    Account &{' '}
                    {userRole === 'Station Admin' ? 'Station' : 'Route'}
                  </Text>
                </Space>
              }
              size="small"
              style={{
                borderColor: '#e8e8e8',
                height: '100%',
              }}
              bodyStyle={{ padding: '12px' }}
              headStyle={{
                padding: '0 12px',
                minHeight: 'auto',
                lineHeight: '32px',
              }}
            >
              <Form.Item
                label={
                  <Space size={4}>
                    <FaUser
                      size={10}
                      style={{ color: getRoleColor(), fontSize: '12px' }}
                    />
                    <Text strong style={{ fontSize: '12px' }}>
                      Username
                    </Text>
                    <Tag
                      color="red"
                      style={{
                        fontSize: '8px',
                        padding: '0 3px',
                        height: '16px',
                      }}
                    >
                      Required
                    </Tag>
                  </Space>
                }
                required={false}
                validateStatus={getUsernameValidationStatus()}
                help={
                  <div style={{ fontSize: '11px', marginTop: 2 }}>
                    {getUsernameHelpText()}
                    {isUsernameAvailable === true && (
                      <Tag
                        color="green"
                        style={{
                          marginLeft: 6,
                          fontSize: '9px',
                          padding: '0 3px',
                          height: '16px',
                        }}
                      >
                        Available
                      </Tag>
                    )}
                    {isUsernameAvailable === false && (
                      <Tag
                        color="red"
                        style={{
                          marginLeft: 6,
                          fontSize: '9px',
                          padding: '0 3px',
                          height: '16px',
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
                    <FaUser style={{ color: '#bfbfbf', fontSize: '11px' }} />
                  }
                  style={{
                    borderRadius: '4px',
                    fontSize: '12px',
                    padding: '4px 11px',
                  }}
                  allowClear
                  maxLength={30}
                  disabled={checkingUsername}
                />
              </Form.Item>

              {/* Station Selection for Station Admin */}
              {userRole === 'Station Admin' ? (
                <Form.Item
                  label={
                    <Space size={4}>
                      <FaBuilding
                        size={10}
                        style={{ color: getRoleColor(), fontSize: '12px' }}
                      />
                      <Text strong style={{ fontSize: '12px' }}>
                        Assigned Station
                      </Text>
                      <Tag
                        color="red"
                        style={{
                          fontSize: '8px',
                          padding: '0 3px',
                          height: '16px',
                        }}
                      >
                        Required
                      </Tag>
                    </Space>
                  }
                  required={false}
                  validateStatus={selectedStation ? 'success' : ''}
                  help={
                    <div style={{ fontSize: '11px', marginTop: 2 }}>
                      {!selectedStation ? 'Select a station for the admin' : ''}
                    </div>
                  }
                >
                  <Select
                    placeholder="Select a station for assignment"
                    value={selectedStation}
                    onChange={setSelectedStation}
                    size="middle"
                    style={{
                      width: '100%',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                    dropdownStyle={{
                      borderRadius: '4px',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                    allowClear
                    suffixIcon={
                      <FaBuilding
                        style={{ color: '#bfbfbf', fontSize: '11px' }}
                      />
                    }
                    options={stationOptions}
                    loading={fetchingData && stations.length === 0}
                    listHeight={180}
                    showSearch
                    filterOption={(input, option) =>
                      (
                        option?.label?.props?.children?.[1]?.props?.children ||
                        ''
                      )
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              ) : (
                /* Route Selection for Dispatcher */
                <Form.Item
                  label={
                    <Space size={4}>
                      <FaRoute
                        size={10}
                        style={{ color: getRoleColor(), fontSize: '12px' }}
                      />
                      <Text strong style={{ fontSize: '12px' }}>
                        Assigned Route
                      </Text>
                      <Tag
                        color="red"
                        style={{
                          fontSize: '8px',
                          padding: '0 3px',
                          height: '16px',
                        }}
                      >
                        Required
                      </Tag>
                    </Space>
                  }
                  required={false}
                  validateStatus={selectedRoute ? 'success' : ''}
                  help={
                    <div style={{ fontSize: '11px', marginTop: 2 }}>
                      {!selectedRoute
                        ? 'Select a route for the dispatcher'
                        : ''}
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
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                    dropdownStyle={{
                      borderRadius: '4px',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                    allowClear
                    suffixIcon={
                      <FaRoute style={{ color: '#bfbfbf', fontSize: '11px' }} />
                    }
                    options={routeOptions}
                    loading={fetchingData && routes.length === 0}
                    listHeight={180}
                    showSearch
                    filterOption={(input, option) =>
                      (
                        option?.label?.props?.children?.[1]?.props?.children ||
                        ''
                      )
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}

              {isFormValid && (
                <Alert
                  message="Ready to Create"
                  description={
                    <div style={{ fontSize: '11px' }}>
                      <div style={{ marginBottom: 2 }}>
                        <strong>Name:</strong> {fullName}
                      </div>
                      <div style={{ marginBottom: 2 }}>
                        <strong>Role:</strong>{' '}
                        <Tag
                          color={
                            userRole === 'Station Admin' ? 'purple' : 'blue'
                          }
                          style={{
                            fontSize: '9px',
                            padding: '0 3px',
                            height: '16px',
                          }}
                        >
                          {userRole}
                        </Tag>
                      </div>
                      <div style={{ marginBottom: 2 }}>
                        <strong>Username:</strong>{' '}
                        <Tag
                          color="green"
                          style={{
                            fontSize: '9px',
                            padding: '0 3px',
                            height: '16px',
                          }}
                        >
                          {userName}
                        </Tag>
                      </div>
                      <div>
                        <strong>
                          {userRole === 'Station Admin' ? 'Station' : 'Route'}:
                        </strong>{' '}
                        {userRole === 'Station Admin'
                          ? selectedStation
                          : selectedRoute}
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{
                    marginTop: 12,
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
              )}

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid #f0f0f0',
                }}
              >
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={handleCancel}
                    size="middle"
                    style={{
                      borderRadius: '4px',
                      padding: '0 16px',
                      fontSize: '12px',
                      height: '32px',
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
                      borderRadius: '4px',
                      padding: '0 20px',
                      fontSize: '12px',
                      height: '32px',
                      background: isFormValid ? getRoleColor() : '#d9d9d9',
                      borderColor: isFormValid ? getRoleColor() : '#d9d9d9',
                    }}
                    icon={
                      userRole === 'Station Admin' ? (
                        <MdAdminPanelSettings style={{ fontSize: '11px' }} />
                      ) : (
                        <FaUserPlus style={{ fontSize: '11px' }} />
                      )
                    }
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
                </Space>

                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    <FaExclamationCircle
                      style={{ marginRight: '3px', fontSize: '9px' }}
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

export default CreateUserModal;
