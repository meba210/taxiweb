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
  EnvironmentOutlined,
  BuildOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { TbBusStop, TbBuilding, TbMapPin } from 'react-icons/tb';

import axios from 'axios';

type Station = {
  id: number;
  StationName: string;
  City: string;
  location: string;
  Capacity?: number;
  Status?: 'active' | 'maintenance' | 'closed';
  CreatedAt?: string;
  AssignedAdmins?: number;
};

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStationDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/stations/${id}`);
      setStation(response.data);
    } catch (error) {
      console.error('Error fetching station details:', error);
      message.error('Failed to load station details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'success', text: 'Active' };
      case 'maintenance':
        return { color: 'warning', text: 'Maintenance' };
      case 'closed':
        return { color: 'error', text: 'Closed' };
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
      fetchStationDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!station) {
    return (
      <Card className="shadow-sm">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600">
            Station not found
          </h3>
          <Button
            type="primary"
            onClick={() => navigate('/admin/Stations')}
            className="mt-4"
          >
            Back to Stations
          </Button>
        </div>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(station.Status || 'active');

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/Stations')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Station Details</h1>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={160}>
          <Card className="shadow-sm">
            <div className="flex items-center mb-6">
              <Avatar
                size={64}
                style={{ backgroundColor: '#52c41a' }}
                icon={<TbBusStop />}
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0">
                  {station.StationName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={statusInfo.color as any} />
                  <span className="text-gray-500">{statusInfo.text}</span>
                </div>
              </div>
            </div>

            <Descriptions
              title="Station Information"
              bordered
              column={{ xs: 1, sm: 2 }}
              size="middle"
            >
              <Descriptions.Item label="Station Name">
                <strong>{station.StationName}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Badge
                  status={statusInfo.color as any}
                  text={statusInfo.text}
                />
              </Descriptions.Item>

              <Descriptions.Item label="City">
                <div className="flex items-center">
                  <TbBuilding className="mr-2 text-gray-400" />
                  <span className="font-medium">{station.City}</span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Location">
                <div className="flex items-center">
                  <TbMapPin className="mr-2 text-gray-400" />
                  <span>{station.location}</span>
                </div>
              </Descriptions.Item>

              {station.Capacity && (
                <Descriptions.Item label="Capacity">
                  <div className="flex items-center">
                    <TeamOutlined className="mr-2 text-gray-400" />
                    <span>{station.Capacity} vehicles</span>
                  </div>
                </Descriptions.Item>
              )}

              {station.AssignedAdmins && (
                <Descriptions.Item label="Assigned Admins">
                  <div className="flex items-center">
                    <BuildOutlined className="mr-2 text-gray-400" />
                    <span>{station.AssignedAdmins} admins</span>
                  </div>
                </Descriptions.Item>
              )}

              {station.CreatedAt && (
                <Descriptions.Item label="Created Date" span={2}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    <span>{formatDate(station.CreatedAt)}</span>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <EnvironmentOutlined className="mr-2 text-green-500" />
                Station Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Taxi Stand', 'Waiting Area', 'Parking', 'Security'].map(
                  (feature, index) => (
                    <Tag key={index} color="blue" className="text-sm py-1 px-3">
                      {feature}
                    </Tag>
                  )
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
