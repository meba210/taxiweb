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
} from 'react-icons/fa';

const { Title, Text } = Typography;

type StationAdmin = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Stations: string;
};

type Station = {
  id: number;
  StationName: string;
};

type EditStationAdminModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  StationAdmin: StationAdmin | null;
  onUpdated: (updatedStation: StationAdmin) => void;
};

const EditStationModal: React.FC<EditStationAdminModalProps> = ({
  isOpen,
  handleCancel,
  StationAdmin,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState<StationAdmin | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameCheckTimer, setUsernameCheckTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const token = localStorage.getItem('token');

  const fetchStationadmins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/stations');
      setStations(res.data);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      message.error('Failed to load stations');
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
        originalAdmin &&
        username.trim().toLowerCase() === originalAdmin.UserName.toLowerCase()
      ) {
        setIsUsernameAvailable(true);
        return;
      }

      setCheckingUsername(true);
      try {
        const res = await axios.get('http://localhost:5000/stationadmins', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username: username.trim() },
        });

        const stationAdmins = res.data || [];
        const usernameExists = stationAdmins.some(
          (admin: any) =>
            admin.UserName &&
            admin.UserName.toLowerCase() === username.trim().toLowerCase() &&
            admin.id !== originalAdmin?.id
        );

        setIsUsernameAvailable(!usernameExists);
      } catch (err: any) {
        console.error('Failed to check username:', err);
        setIsUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    },
    [token, originalAdmin]
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
    fetchStationadmins();
  }, []);

  useEffect(() => {
    if (isOpen && StationAdmin) {
      setFullName(StationAdmin.FullName);
      setEmail(StationAdmin.Email);
      setPhoneNumber(String(StationAdmin.PhoneNumber));
      setUserName(StationAdmin.UserName);
      const station = stations.find(
        (s) => s.StationName === StationAdmin.Stations
      );
      setSelectedStation(station ? station.StationName.toString() : '');

      setOriginalAdmin(StationAdmin);
      setIsUsernameAvailable(true);

      form.setFieldsValue({
        FullName: StationAdmin.FullName,
        Email: StationAdmin.Email,
        PhoneNumber: StationAdmin.PhoneNumber,
        UserName: StationAdmin.UserName,
        Stations: station ? station.StationName : '',
      });
    }
  }, [isOpen, StationAdmin, stations]);

  useEffect(() => {
    const isValid =
      fullName &&
      email &&
      phoneNumber &&
      userName &&
      selectedStation &&
      fullName.trim().length >= 2 &&
      /^[A-Za-z\s'-]+$/.test(fullName.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      (/^09\d{8}$/.test(phoneNumber.toString()) ||
        /^\+2519\d{9}$/.test(phoneNumber.toString())) &&
      userName.trim().length >= 3 &&
      (isUsernameAvailable === true ||
        (originalAdmin &&
          userName.trim().toLowerCase() ===
            originalAdmin.UserName.toLowerCase()));

    setIsFormValid(!!isValid);
  }, [
    fullName,
    email,
    phoneNumber,
    userName,
    selectedStation,
    isUsernameAvailable,
    originalAdmin,
  ]);

  const hasChanges = () => {
    if (!originalAdmin) return false;
    return (
      fullName.trim() !== originalAdmin.FullName ||
      email.trim() !== originalAdmin.Email ||
      phoneNumber !== originalAdmin.PhoneNumber ||
      userName.trim() !== originalAdmin.UserName ||
      selectedStation !== originalAdmin.Stations
    );
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      message.warning("Please enter the admin's full name");
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

    const phoneStr = phoneNumber.toString();
    if (!(/^09\d{8}$/.test(phoneStr) || /^\+2519\d{8}$/.test(phoneStr))) {
      message.warning(
        'Please enter a valid Ethiopian phone number (09XXXXXXXXX or +2519XXXXXXXX)'
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
      !originalAdmin ||
      userName.trim().toLowerCase() !== originalAdmin.UserName.toLowerCase()
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

    if (!selectedStation) {
      message.warning('Please select a station');
      return;
    }

    if (!hasChanges()) {
      message.info('No changes detected');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/stationadmins/${StationAdmin?.id}`,
        {
          FullName: fullName.trim(),
          Email: email.trim().toLowerCase(),
          PhoneNumber: phoneNumber.replace(/\s/g, ''),
          UserName: userName.trim(),
          Stations: selectedStation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const stationName =
        stations.find((s) => s.id === Number(selectedStation))?.StationName ||
        selectedStation;

      message.success({
        content: res.data.message || '✅ Station Admin updated successfully!',
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      onUpdated({
        ...StationAdmin!,
        FullName: fullName.trim(),
        Email: email.trim().toLowerCase(),
        PhoneNumber: phoneNumber.replace(/\s/g, ''),
        UserName: userName.trim(),
        Stations: stationName,
      });

      handleCancel();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update station admin';
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

  const stationOptions = stations.map((station) => ({
    label: (
      <Space>
        <FaBuilding style={{ color: '#722ed1' }} />
        <Text style={{ fontSize: '13px' }}>{station.StationName}</Text>
      </Space>
    ),
    value: station.StationName,
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
      originalAdmin &&
      userName.trim().toLowerCase() === originalAdmin.UserName.toLowerCase()
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
              backgroundColor: '#722ed1',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaUserShield size={18} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Edit Station Admin
          </Title>
          {StationAdmin && (
            <Tag color="purple" style={{ marginLeft: 8, fontSize: '11px' }}>
              ID: {StationAdmin.id}
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
          message="Update Station Admin Information"
          description={
            StationAdmin
              ? `Editing ${StationAdmin.FullName}'s details`
              : 'Loading admin information...'
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
                  <FaUser style={{ color: '#722ed1', fontSize: '14px' }} />
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
                      style={{ color: '#722ed1', fontSize: '14px' }}
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
                      : "Admin's full name"}
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
                      style={{ color: '#722ed1', fontSize: '14px' }}
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
                      style={{ color: '#722ed1', fontSize: '14px' }}
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
                    ? /^09\d{8}$/.test(phoneNumber.replace(/\s/g, '')) ||
                      /^\+2519\d{9}$/.test(phoneNumber.replace(/\s/g, ''))
                      ? 'success'
                      : 'error'
                    : ''
                }
                help={
                  <div style={{ fontSize: '12px' }}>
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
                    const raw = e.target.value.replace(/\s/g, '');
                    const cleaned = raw.replace(/[^0-9+]/g, '');
                    setPhoneNumber(cleaned);
                  }}
                  size="middle"
                  prefix={
                    <FaPhoneAlt
                      style={{ color: '#bfbfbf', fontSize: '12px' }}
                    />
                  }
                  style={{ borderRadius: '5px', fontSize: '13px' }}
                  allowClear
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FaUserShield
                    style={{ color: '#722ed1', fontSize: '14px' }}
                  />
                  <Text strong style={{ fontSize: '14px' }}>
                    Account & Station
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
                      style={{ color: '#722ed1', fontSize: '14px' }}
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
                      originalAdmin &&
                      userName.trim().toLowerCase() !==
                        originalAdmin.UserName.toLowerCase() && (
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
                    {originalAdmin &&
                      userName.trim().toLowerCase() ===
                        originalAdmin.UserName.toLowerCase() && (
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
                    <FaBuilding
                      size={11}
                      style={{ color: '#722ed1', fontSize: '14px' }}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                      Assigned Station
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
                validateStatus={selectedStation ? 'success' : ''}
                help={
                  <div style={{ fontSize: '12px' }}>
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
                    <FaBuilding
                      style={{ color: '#bfbfbf', fontSize: '12px' }}
                    />
                  }
                  options={stationOptions}
                  loading={stations.length === 0}
                  listHeight={200}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label?.props?.children?.[1]?.props?.children || '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              {hasChanges() && originalAdmin && (
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

                    {fullName !== originalAdmin.FullName && (
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
                          {originalAdmin.FullName}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {fullName}
                        </Text>
                      </div>
                    )}

                    {phoneNumber !== originalAdmin.PhoneNumber && (
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
                          {originalAdmin.PhoneNumber}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {phoneNumber}
                        </Text>
                      </div>
                    )}

                    {userName !== originalAdmin.UserName && (
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
                          {originalAdmin.UserName}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {userName}
                        </Text>
                      </div>
                    )}

                    {selectedStation !== originalAdmin.Stations && (
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
                          {originalAdmin.Stations}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                          → {selectedStation}
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
                        {originalAdmin &&
                          userName.trim().toLowerCase() !==
                            originalAdmin.UserName.toLowerCase() && (
                            <Tag
                              color="green"
                              style={{ marginLeft: 4, fontSize: '10px' }}
                            >
                              ✓
                            </Tag>
                          )}
                      </div>
                      <div>
                        <strong>Station:</strong> {selectedStation}
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
                        isFormValid && hasChanges() ? '#722ed1' : '#d9d9d9',
                      borderColor:
                        isFormValid && hasChanges() ? '#722ed1' : '#d9d9d9',
                    }}
                    icon={<FaUserShield style={{ fontSize: '12px' }} />}
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

export default EditStationModal;
