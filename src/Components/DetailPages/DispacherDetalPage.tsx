import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Avatar,
  Divider,
  Skeleton,
  message,
  Badge,
} from 'antd';
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { TbRoute } from 'react-icons/tb';
import { RiUserSettingsLine } from 'react-icons/ri';
import axios from 'axios';

type Dispacher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Routes: string;
  Status?: 'active' | 'inactive';
  CreatedAt?: string;
  AssignedStations?: number;
  TotalAssignments?: number;
  PerformanceRating?: number;
};

export default function DispatcherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dispacher, setDispacher] = useState<Dispacher | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchDispatcherDetails = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/dispachers/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let dispatcherData: Dispacher | null = null;

      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          dispatcherData = response.data[0];
        }
      } else {
        dispatcherData = response.data;
      }

      setDispacher(dispatcherData);
    } catch (error: any) {
      console.error('Error fetching dispatcher details:', error);
      message.error(
        error.response?.data?.message || 'Failed to load dispatcher details'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'success', text: 'Active' };
      case 'inactive':
        return { color: 'default', text: 'Inactive' };
      case 'on_leave':
        return { color: 'warning', text: 'On Leave' };
      default:
        return { color: 'default', text: 'Unknown' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (id) {
      fetchDispatcherDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!dispacher) {
    return (
      <Card className="shadow-sm">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600">
            Dispatcher not found
          </h3>
          <Button
            type="primary"
            onClick={() => navigate('/stationAdmin/Dispachers')}
            className="mt-4"
          >
            Back to Dispatchers
          </Button>
        </div>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(dispacher.Status || 'active');
  const routeList = dispacher.Routes
    ? dispacher.Routes.split(',').map((r) => r.trim())
    : [];

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/stationAdmin/Dispachers')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            Dispatcher Details
          </h1>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex items-center mb-6">
              <Avatar
                size={64}
                style={{ backgroundColor: '#1890ff' }}
                icon={<RiUserSettingsLine />}
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0">
                  {dispacher.FullName}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge
                    status={statusInfo.color as any}
                    text={statusInfo.text}
                  />
                  <span className="text-gray-500">@{dispacher.UserName}</span>
                </div>
              </div>
            </div>

            <Descriptions
              title="Dispatcher Information"
              bordered
              column={{ xs: 1, sm: 2 }}
              size="middle"
            >
              <Descriptions.Item label="Full Name">
                <strong>{dispacher.FullName}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Username">
                <Tag color="blue" icon={<UserOutlined />}>
                  @{dispacher.UserName}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Badge
                  status={statusInfo.color as any}
                  text={statusInfo.text}
                />
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                <div className="flex items-center">
                  <MailOutlined className="mr-2 text-gray-400" />
                  <a
                    href={`mailto:${dispacher.Email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {dispacher.Email}
                  </a>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2 text-gray-400" />
                  <span>0{dispacher.PhoneNumber}</span>
                </div>
              </Descriptions.Item>

              {dispacher.CreatedAt && (
                <Descriptions.Item label="Join Date" span={2}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    <span>{formatDate(dispacher.CreatedAt)}</span>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TbRoute className="mr-2 text-green-500" />
                Assigned Routes
              </h3>
              <div className="flex flex-wrap gap-2">
                {routeList.length > 0 ? (
                  routeList.map((route, index) => (
                    <Card
                      key={index}
                      size="small"
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <TbRoute className="mr-2 text-blue-500" />
                        <div>
                          <div className="font-medium">{route}</div>
                          <div className="text-xs text-gray-500">
                            Active • Full Access
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No routes assigned</p>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <Button
                type="primary"
                block
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${dispacher.Email}`)}
              >
                Send Email
              </Button>

              <Button
                block
                icon={<PhoneOutlined />}
                onClick={() => window.open(`tel:+${dispacher.PhoneNumber}`)}
              >
                Call Dispatcher
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Permissions</h3>
            <div className="space-y-3">
              {[{ permission: 'Route Management', access: 'Full' }].map(
                (perm, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <SafetyCertificateOutlined className="mr-2 text-gray-400" />
                      <div className="text-sm">{perm.permission}</div>
                    </div>
                    <Badge
                      color={
                        perm.access === 'Full'
                          ? 'success'
                          : perm.access === 'Limited'
                          ? 'warning'
                          : ('default' as any)
                      }
                      text={perm.access}
                    />
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
