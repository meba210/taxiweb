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
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaBuilding,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';

const { Title, Text } = Typography;

type CreateStationAdminProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onStationAdminCreated?: () => void;
};

type Station = {
  StationName: string;
};

const CreateStationAdmin: React.FC<CreateStationAdminProps> = ({
  isModalOpen,
  handleCancel,
  onStationAdminCreated,
}) => {
  const [form] = Form.useForm();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
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
    const fetchStations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/stations');
        setStations(res.data);
      } catch (err) {
        console.error('Failed to fetch stations:', err);
        message.error('Failed to load stations');
      }
    };

    if (isModalOpen) {
      fetchStations();
    }
  }, [isModalOpen]);

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username.trim() || username.trim().length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      if (!token) return;

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
            admin.UserName.toLowerCase() === username.trim().toLowerCase()
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
      selectedStation &&
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

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/stationadmins',
        {
          FullName: fullName.trim(),
          Email: email.trim().toLowerCase(),
          PhoneNumber: phoneNumber.replace(/\s/g, ''),
          UserName: userName.trim(),
          selectedStation,
          role_id: 2,
        },
        { withCredentials: true }
      );

      message.success({
        content: res.data.message || '✅ Station Admin created successfully!',
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setUserName('');
      setSelectedStation(undefined);
      setIsUsernameAvailable(null);
      form.resetFields();

      handleCancel();
      onStationAdminCreated?.();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || 'Failed to create station admin';
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
        <FaBuilding style={{ color: '#722ed1' }} />
        <Text style={{ fontSize: '13px' }}>{station.StationName}</Text>
      </Space>
    ),
    value: station.StationName,
  }));

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
              backgroundColor: '#722ed1',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MdAdminPanelSettings size={18} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Create Station Admin
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
          message="Station Administrator Information"
          description="Fill all required fields to create a new station admin account"
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
                    const formatted = formatPhoneNumber(e.target.value);
                    setPhoneNumber(formatted);
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
                  <MdAdminPanelSettings
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
                        <strong>Station:</strong> {selectedStation}
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
                      background: isFormValid ? '#722ed1' : '#d9d9d9',
                      borderColor: isFormValid ? '#722ed1' : '#d9d9d9',
                    }}
                    icon={<MdAdminPanelSettings style={{ fontSize: '12px' }} />}
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

export default CreateStationAdmin;
