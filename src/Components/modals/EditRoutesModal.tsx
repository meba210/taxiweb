import {
  Modal,
  Input,
  Button,
  message,
  Form,
  Card,
  Space,
  Typography,
  Alert,
  Divider,
  Tag,
} from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaRoute,
  FaMapMarkerAlt,
  FaMapPin,
  FaExclamationCircle,
  FaCheckCircle,
  FaEdit,
  FaInfoCircle,
} from 'react-icons/fa';
import { GiPathDistance } from 'react-icons/gi';

const { Title, Text } = Typography;

type Routes = {
  id: number;
  station_name?: string;
  EndTerminal: string;
  StartTerminal?: string;
};

type EditRoutesModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  route: Routes | null;
  onUpdated: (updatedRoute: Routes) => void;
};

const EditRoutesModal: React.FC<EditRoutesModalProps> = ({
  isOpen,
  handleCancel,
  route,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [StartTerminal, setStartTerminal] = useState('');
  const [EndTerminal, setEndTerminal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalRoute, setOriginalRoute] = useState<Routes | null>(null);

  useEffect(() => {
    if (isOpen && route) {
      const startTerminal = route.station_name || route.StartTerminal || '';
      setStartTerminal(startTerminal);
      setEndTerminal(route.EndTerminal);
      setOriginalRoute(route);
      form.setFieldsValue({
        StartTerminal: startTerminal,
        EndTerminal: route.EndTerminal,
      });
    }
  }, [isOpen, route]);

  useEffect(() => {
    const isValid = EndTerminal && EndTerminal.trim().length >= 2;
    setIsFormValid(!!isValid);
  }, [EndTerminal]);

  const handleUpdate = async () => {
    if (!EndTerminal.trim()) {
      message.warning('Please enter the end terminal');
      return;
    }

    if (EndTerminal.trim().length < 2) {
      message.warning('End terminal should be at least 2 characters long');
      return;
    }

    if (originalRoute && EndTerminal.trim() === originalRoute.EndTerminal) {
      message.info('No changes detected. Please modify at least one field.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      message.error('No token found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `http://localhost:5000/routes/${route?.id}`,
        {
          EndTerminal: EndTerminal.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success({
        content: res.data.message || '✅ Route updated successfully!',
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      onUpdated({
        ...route!,
        EndTerminal: EndTerminal.trim(),
      });
      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || 'Failed to update route',
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!originalRoute) return false;
    return EndTerminal.trim() !== originalRoute.EndTerminal;
  };

  return (
    <Modal
      open={isOpen}
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
            <FaEdit size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>
            Edit Route
          </Title>
          {route && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              ID: {route.id}
            </Tag>
          )}
        </Space>
      }
      styles={{
        body: { padding: '24px 0' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' },
      }}
    >
      <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
        <Alert
          message="Update route information"
          description={`Editing route ID: ${route?.id}`}
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        <Card
          title={
            <Space>
              <GiPathDistance style={{ color: '#52c41a' }} />
              <Text strong>Route Details</Text>
              {hasChanges() && (
                <Tag color="orange" style={{ marginLeft: '8px' }}>
                  Unsaved Changes
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
                <FaMapMarkerAlt size={12} />
                <Text strong>Start Terminal</Text>
                <Tag color="blue" style={{ fontSize: '10px' }}>
                  Read Only
                </Tag>
              </Space>
            }
          >
            <Input
              value={StartTerminal}
              readOnly
              size="large"
              prefix={<FaMapMarkerAlt style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px', backgroundColor: '#f5f5f5' }}
            />
          </Form.Item>

          <Divider>
            <FaRoute style={{ color: '#d9d9d9', margin: '0 8px' }} />
            <Text type="secondary">to</Text>
          </Divider>

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
              EndTerminal
                ? EndTerminal.trim().length >= 2
                  ? 'success'
                  : 'error'
                : ''
            }
            help={
              EndTerminal ? (
                EndTerminal.trim().length < 2 ? (
                  'Terminal name should be at least 2 characters long'
                ) : originalRoute &&
                  EndTerminal.trim() !== originalRoute.EndTerminal ? (
                  <Space size={4}>
                    <FaInfoCircle style={{ color: '#1890ff' }} />
                    <Text type="secondary">
                      Changed from "{originalRoute.EndTerminal}"
                    </Text>
                  </Space>
                ) : (
                  ''
                )
              ) : (
                'Enter the destination point of the route'
              )
            }
          >
            <Input
              placeholder="e.g., Mexico, Piassa, Gofa"
              value={EndTerminal}
              onChange={(e) => {
                const value = e.target.value.replace(/[^A-Za-z0-9\s.,'-]/g, '');
                const limited = value.substring(0, 50);
                setEndTerminal(limited);
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

        {originalRoute && hasChanges() && (
          <Card
            size="small"
            style={{
              marginBottom: 24,
              borderColor: '#b7eb8f',
              backgroundColor: '#f6ffed',
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text strong style={{ color: '#389e0d' }}>
                Changes Preview
              </Text>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Original
                  </Text>
                  <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                    {StartTerminal} → {originalRoute.EndTerminal}
                  </Text>
                </div>
                <FaRoute style={{ color: '#52c41a' }} />
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Updated
                  </Text>
                  <Text
                    style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#1890ff',
                    }}
                  >
                    {StartTerminal} → {EndTerminal.trim()}
                  </Text>
                </div>
              </div>
              {originalRoute.EndTerminal !== EndTerminal.trim() && (
                <Alert
                  message={`End terminal will change from "${
                    originalRoute.EndTerminal
                  }" to "${EndTerminal.trim()}"`}
                  type="info"
                  showIcon
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              )}
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
            onClick={handleUpdate}
            size="large"
            disabled={!isFormValid || !hasChanges()}
            style={{
              borderRadius: '6px',
              padding: '0 32px',
              background: isFormValid && hasChanges() ? '#52c41a' : '#d9d9d9',
              borderColor: isFormValid && hasChanges() ? '#52c41a' : '#d9d9d9',
            }}
            icon={<FaEdit />}
          >
            {loading ? 'Updating...' : 'Update Route'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default EditRoutesModal;
