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
  Tag,
  Row,
  Col,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaExclamationCircle,
  FaCheckCircle,
  FaUserShield,
  FaRoute,
  FaUserEdit,
} from 'react-icons/fa';
import { MdDriveFileRenameOutline, MdAdminPanelSettings } from 'react-icons/md';

const { Title, Text } = Typography;

type User = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Role: string;
  isActive: boolean;
  Stations?: string;
  Routes?: string;
};

type Station = {
  id: number;
  StationName: string;
};

type Route = {
  id: number;
  station_name: string;
  EndTerminal: string;
};

type EditUserModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  user: User | null;
  onUpdated: (updatedUser: User) => void;
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  handleCancel,
  user,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalData, setOriginalData] = useState<User | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameCheckTimer, setUsernameCheckTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const token = localStorage.getItem('token');
  const userRole =
    user?.Role || (user?.Routes ? 'Dispatcher' : 'Station Admin');

  const fetchData = async () => {
    setFetchingData(true);
    try {
      const stationsRes = await axios.get('http://localhost:5000/stations');
      setStations(stationsRes.data);

      const routesRes = await axios.get('http://localhost:5000/routes');
      const mappedRoutes = routesRes.data.map((route: any) => ({
        id: route.id,
        station_name:
          route.station_name || route.StartTerminal || 'Main Station',
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
  };

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username.trim() || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (
        originalData &&
        username.trim().toLowerCase() === originalData.UserName.toLowerCase()
      ) {
        setIsUsernameAvailable(true);
        return;
      }

      setCheckingUsername(true);
      try {
        const allUsersRes = await axios.get('http://localhost:5000/allUsers', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const allUsers = allUsersRes.data || [];

        const usernameExists = allUsers.some(
          (user: any) =>
            user.UserName &&
            user.UserName.toLowerCase() === username.trim().toLowerCase() &&
            user.id !== originalData?.id
        );

        setIsUsernameAvailable(!usernameExists);
      } catch (err: any) {
        console.error('Failed to check username:', err);

        try {
          let usernameExists = false;

          const stationAdminsRes = await axios.get(
            'http://localhost:5000/stationadmins'
          );
          const stationAdmins = stationAdminsRes.data || [];
          usernameExists = stationAdmins.some(
            (admin: any) =>
              admin.UserName &&
              admin.UserName.toLowerCase() === username.trim().toLowerCase() &&
              admin.id !== originalData?.id
          );

          if (!usernameExists) {
            const dispatchersRes = await axios.get(
              'http://localhost:5000/dispachers',
              {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              }
            );
            const dispatchers = dispatchersRes.data || [];
            usernameExists = dispatchers.some(
              (dispatcher: any) =>
                dispatcher.UserName &&
                dispatcher.UserName.toLowerCase() ===
                  username.trim().toLowerCase() &&
                dispatcher.id !== originalData?.id
            );
          }

          setIsUsernameAvailable(!usernameExists);
        } catch (fallbackErr: any) {
          console.error('Fallback check failed:', fallbackErr);
          setIsUsernameAvailable(null);
        }
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
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.FullName);
      setEmail(user.Email);
      setPhoneNumber(String(user.PhoneNumber));
      setUserName(user.UserName);
      setOriginalData(user);

      if (userRole === 'Station Admin') {
        setSelectedStation(user.Stations || '');
        form.setFieldsValue({
          FullName: user.FullName,
          Email: user.Email,
          PhoneNumber: user.PhoneNumber,
          UserName: user.UserName,
          assignment: user.Stations || '',
        });
      } else {
        setSelectedRoute(user.Routes || '');
        form.setFieldsValue({
          FullName: user.FullName,
          Email: user.Email,
          PhoneNumber: user.PhoneNumber,
          UserName: user.UserName,
          assignment: user.Routes || '',
        });
      }

      setIsUsernameAvailable(true);
    }
  }, [isOpen, user, form, userRole]);

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
    selectedStation,
    selectedRoute,
    isUsernameAvailable,
    originalData,
    userRole,
  ]);

  const hasChanges = () => {
    if (!originalData) return false;

    if (userRole === 'Station Admin') {
      return (
        fullName.trim() !== originalData.FullName ||
        email.trim() !== originalData.Email ||
        phoneNumber !== originalData.PhoneNumber ||
        userName.trim() !== originalData.UserName ||
        selectedStation !== (originalData.Stations || '')
      );
    } else {
      return (
        fullName.trim() !== originalData.FullName ||
        email.trim() !== originalData.Email ||
        phoneNumber !== originalData.PhoneNumber ||
        userName.trim() !== originalData.UserName ||
        selectedRoute !== (originalData.Routes || '')
      );
    }
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      message.warning("Please enter the user's full name");
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

    const phoneStr = phoneNumber.toString().replace(/\s/g, '');
    if (!(/^09\d{8}$/.test(phoneStr) || /^\+2519\d{9}$/.test(phoneStr))) {
      message.warning(
        'Please enter a valid Ethiopian phone number (09XXXXXXXX or +2519XXXXXXXX)'
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

    if (userRole === 'Station Admin' && !selectedStation) {
      message.warning('Please select a station');
      return;
    }

    if (userRole === 'Dispatcher' && !selectedRoute) {
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

      const endpoint =
        userRole === 'Station Admin'
          ? `http://localhost:5000/stationadmins/${user?.id}`
          : `http://localhost:5000/dispachers/${user?.id}`;

      const payload = {
        FullName: fullName.trim(),
        Email: email.trim().toLowerCase(),
        PhoneNumber: phoneStr,
        UserName: userName.trim(),
      };

      if (userRole === 'Station Admin') {
        (payload as any).Stations = selectedStation;
      } else {
        (payload as any).Routes = selectedRoute;
      }

      const res = await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success({
        content: res.data.message || `✅ ${userRole} updated successfully!`,
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      const updatedUser: User = {
        id: user!.id,
        FullName: fullName.trim(),
        Email: email.trim().toLowerCase(),
        PhoneNumber: phoneStr,
        UserName: userName.trim(),
        Role: userRole,
        isActive: user!.isActive,
      };

      if (userRole === 'Station Admin') {
        updatedUser.Stations = selectedStation;
      } else {
        updatedUser.Routes = selectedRoute;
      }

      onUpdated(updatedUser);
      handleCancel();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || `Failed to update ${userRole}`;
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
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedStation('');
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

  const getRoleColor = () => {
    return userRole === 'Station Admin' ? '#722ed1' : '#1890ff';
  };

  const getRoleIcon = () => {
    return userRole === 'Station Admin' ? (
      <MdAdminPanelSettings size={16} color="#fff" />
    ) : (
      <FaUserEdit size={16} color="#fff" />
    );
  };

  const getRoleTitle = () => {
    return userRole === 'Station Admin' ? 'Station Admin' : 'Dispatcher';
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

  const stationOptions = stations.map((station) => ({
    label: (
      <Space>
        <FaBuilding style={{ color: '#722ed1', fontSize: '12px' }} />
        <Text style={{ fontSize: '13px' }}>{station.StationName}</Text>
      </Space>
    ),
    value: station.StationName,
  }));

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

  const getOriginalField = (
    field: 'FullName' | 'Email' | 'PhoneNumber' | 'UserName' | 'assignment'
  ) => {
    if (!originalData) return '';
    if (field === 'assignment') {
      return userRole === 'Station Admin'
        ? originalData.Stations || ''
        : originalData.Routes || '';
    }
    return originalData[field];
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
              backgroundColor: getRoleColor(),
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getRoleIcon()}
          </div>
          <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
            Edit {getRoleTitle()}
          </Title>
          {user && (
            <Tag
              color={userRole === 'Station Admin' ? 'purple' : 'blue'}
              style={{ marginLeft: 8, fontSize: '11px' }}
            >
              ID: {user.id}
            </Tag>
          )}
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
          message={`Update ${getRoleTitle()} Information`}
          description={
            user
              ? `Editing ${user.FullName}'s details`
              : 'Loading user information...'
          }
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{
            marginBottom: 16,
            borderRadius: '6px',
            fontSize: '13px',
          }}
        />

        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FaUser style={{ color: getRoleColor(), fontSize: '13px' }} />
                  <Text strong style={{ fontSize: '13px' }}>
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
                  placeholder={
                    userRole === 'Station Admin'
                      ? '0912345678 or +251912345678'
                      : '0912345678'
                  }
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
                    <FaUserShield
                      style={{ color: getRoleColor(), fontSize: '13px' }}
                    />
                  ) : (
                    <MdDriveFileRenameOutline
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
                    {isUsernameAvailable === true &&
                      originalData &&
                      userName.trim().toLowerCase() !==
                        originalData.UserName.toLowerCase() && (
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
                    {originalData &&
                      userName.trim().toLowerCase() ===
                        originalData.UserName.toLowerCase() && (
                        <Tag
                          color="blue"
                          style={{
                            marginLeft: 6,
                            fontSize: '9px',
                            padding: '0 3px',
                            height: '16px',
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

              {hasChanges() && originalData && (
                <Card
                  size="small"
                  style={{
                    marginBottom: 12,
                    borderColor: '#d6e4ff',
                    backgroundColor: '#f0f7ff',
                  }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <Space
                    direction="vertical"
                    size={4}
                    style={{ width: '100%' }}
                  >
                    <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                      Changes Summary
                    </Text>

                    {fullName !== getOriginalField('FullName') && (
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
                          {getOriginalField('FullName')}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {fullName}
                        </Text>
                      </div>
                    )}

                    {phoneNumber !== getOriginalField('PhoneNumber') && (
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
                          {getOriginalField('PhoneNumber')}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {phoneNumber}
                        </Text>
                      </div>
                    )}

                    {userName !== getOriginalField('UserName') && (
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
                          {getOriginalField('UserName')}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {userName}
                        </Text>
                      </div>
                    )}

                    {userRole === 'Station Admin' &&
                      selectedStation !== getOriginalField('assignment') && (
                        <div>
                          <Text
                            type="secondary"
                            style={{ fontSize: '11px', marginRight: 4 }}
                          >
                            Station:
                          </Text>
                          <Text
                            style={{
                              fontSize: '11px',
                              textDecoration: 'line-through',
                              color: '#ff4d4f',
                              marginRight: 4,
                            }}
                          >
                            {getOriginalField('assignment')}
                          </Text>
                          <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                            → {selectedStation}
                          </Text>
                        </div>
                      )}

                    {userRole === 'Dispatcher' &&
                      selectedRoute !== getOriginalField('assignment') && (
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
                            {getOriginalField('assignment')}
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
                    <div style={{ fontSize: '11px' }}>
                      <div style={{ marginBottom: 2 }}>
                        <strong>Name:</strong> {fullName}
                      </div>
                      <div style={{ marginBottom: 2 }}>
                        <strong>Username:</strong> {userName}
                        {originalData &&
                          userName.trim().toLowerCase() !==
                            originalData.UserName.toLowerCase() && (
                            <Tag
                              color="green"
                              style={{
                                marginLeft: 4,
                                fontSize: '9px',
                                padding: '0 3px',
                                height: '16px',
                              }}
                            >
                              ✓
                            </Tag>
                          )}
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
                    marginBottom: 12,
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
                    onClick={handleUpdate}
                    size="middle"
                    disabled={!isFormValid || !hasChanges()}
                    style={{
                      borderRadius: '4px',
                      padding: '0 20px',
                      fontSize: '12px',
                      height: '32px',
                      background:
                        isFormValid && hasChanges()
                          ? getRoleColor()
                          : '#d9d9d9',
                      borderColor:
                        isFormValid && hasChanges()
                          ? getRoleColor()
                          : '#d9d9d9',
                    }}
                    icon={
                      userRole === 'Station Admin' ? (
                        <FaUserShield style={{ fontSize: '11px' }} />
                      ) : (
                        <FaUserEdit style={{ fontSize: '11px' }} />
                      )
                    }
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </Button>
                </Space>

                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '10px' }}>
                    <FaExclamationCircle
                      style={{ marginRight: '3px', fontSize: '9px' }}
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

export default EditUserModal;
