import {
  Button,
  Input,
  message,
  Modal,
  Form,
  Card,
  Space,
  Typography,
  Alert,
  Tag,
} from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  FaRoute,
  FaMapMarkerAlt,
  FaMapPin,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';

const { Title, Text } = Typography;

type CreateRoutesProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onRoutesCreated?: () => void;
};

const CreateRoutes: React.FC<CreateRoutesProps> = ({
  isModalOpen,
  handleCancel,
  onRoutesCreated,
}) => {
  const [form] = Form.useForm();
  const [StartTerminal] = useState('');
  const [EndTerminal, setEndTerminal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [routeExistsError, setRouteExistsError] = useState('');
  useEffect(() => {
    const isValid = EndTerminal && EndTerminal.trim().length >= 2;
    setIsFormValid(!!isValid);
  }, [EndTerminal]);

  const handleCreate = async () => {
    if (!EndTerminal.trim()) {
      message.warning('Please enter the end terminal name');
      return;
    }

    if (EndTerminal.trim().length < 2) {
      message.warning('End terminal should be at least 2 characters long');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.error({
        content: 'No token found. Please login again.',
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:5000/routes',
        {
          EndTerminal: EndTerminal.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success({
        content: 'Route created successfully!',
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      setEndTerminal('');
      form.resetFields();

      onRoutesCreated?.();
      handleCancel();
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 409) {
        setRouteExistsError('This route already exists');
      } else {
        message.error(
          err.response?.data?.message || 'Failed to create station'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setEndTerminal('');
      form.resetFields();
    }
  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      title={
        <Space align="center">
          <div
            style={{
              backgroundColor: '#52c41a',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaRoute size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Create New Route
          </Title>
        </Space>
      }
      styles={{
        body: { padding: '24px 0' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' },
      }}
    >
      <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
        <Alert
          message="Define a new transportation route"
          description="Enter end terminals to create a new route"
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        <Card
          title={
            <Space>
              <GiPathDistance style={{ color: '#52c41a' }} />
              <Text strong>Route Information</Text>
              {isFormValid && (
                <Tag color="green" style={{ marginLeft: '8px' }}>
                  Valid Route
                </Tag>
              )}
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Form.Item
            label={
              <Space size={4}>
                <FaMapPin size={12} />
                <Text strong>End Terminal</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>
                  Required
                </Tag>
              </Space>
            }
            required
            validateStatus={
              routeExistsError
                ? 'error'
                : EndTerminal
                ? EndTerminal.trim().length >= 2
                  ? 'success'
                  : 'error'
                : ''
            }
            help={
              routeExistsError
                ? routeExistsError
                : EndTerminal
                ? EndTerminal.trim().length < 2
                  ? 'Terminal name should be at least 2 characters long'
                  : ''
                : 'Enter the destination point of the route'
            }
          >
            <Input
              placeholder="e.g., Mexico, Piassa, Gofa"
              value={EndTerminal}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z0-9\s.,'-]/g, '');

                const limited = value.substring(0, 50);
                setEndTerminal(limited);
                setRouteExistsError('');
              }}
              size="large"
              prefix={
                <Space size={4}>
                  <FaMapPin style={{ color: '#bfbfbf' }} />
                  {EndTerminal && EndTerminal.trim().length >= 2 && (
                    <Tag
                      color="orange"
                      style={{
                        fontSize: '10px',
                        padding: '0 4px',
                        height: '16px',
                      }}
                    >
                      END
                    </Tag>
                  )}
                </Space>
              }
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={50}
              onBlur={() => {
                if (EndTerminal.trim()) {
                  const capitalized = EndTerminal.trim()
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ');
                  setEndTerminal(capitalized);
                }
              }}
            />
          </Form.Item>
        </Card>

        {StartTerminal.trim() && EndTerminal.trim() && (
          <Card
            size="small"
            style={{
              marginBottom: 24,
              borderColor: isFormValid ? '#b7eb8f' : '#ffe58f',
              backgroundColor: isFormValid ? '#f6ffed' : '#fffbe6',
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space align="start">
              <FaRoute
                style={{
                  color: isFormValid ? '#52c41a' : '#faad14',
                  marginTop: '2px',
                }}
              />
            </Space>
          </Card>
        )}

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            onClick={handleCancel}
            size="large"
            style={{ borderRadius: '6px', padding: '0 24px' }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            loading={loading}
            onClick={handleCreate}
            size="large"
            disabled={!isFormValid}
            style={{
              borderRadius: '6px',
              padding: '0 32px',
              background: isFormValid ? '#52c41a' : '#d9d9d9',
              borderColor: isFormValid ? '#52c41a' : '#d9d9d9',
            }}
            icon={<FaRoute />}
          >
            {loading ? 'Creating Route...' : 'Create Route'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreateRoutes;
