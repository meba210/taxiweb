// src/pages/RouteDetail.tsx
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
  Space,
  Popconfirm,
  Tooltip,
  Timeline,
  Statistic
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CarOutlined,
  ScheduleOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { TbEdit, TbRoute, TbBus, TbRoute2 } from "react-icons/tb";
import { RiDeleteBin6Line, RiRouteLine } from "react-icons/ri";
import { CiLocationArrow1, CiTimer } from "react-icons/ci";
import axios from 'axios';

type Route = {
  id: number;
  StartTerminal: string;
  EndTerminal: string;
  Distance?: number;
  Duration?: number;
  Status?: 'active' | 'inactive' | 'maintenance';
  AssignedVehicles?: number;
  DailyTrips?: number;
  CreatedAt?: string;
  Stations?: string[];
};

export default function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);


  const token = localStorage.getItem("token");

  // Fetch route details
  const fetchRouteDetails = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
       let routeData: Route | null = null;
      
      if (Array.isArray(response.data)) {
        // If it's an array, take the first item
        if (response.data.length > 0) {
          routeData = response.data[0];
        }
      } else {
        // If it's already an object
        routeData = response.data;
      }
      
      setRoute(routeData);
      
    } catch (error: any) {
      console.error('Error fetching route details:', error);
      message.error(error.response?.data?.message || 'Failed to load route details');
    } finally {
      setLoading(false);
    }
  };
 

  // Get status color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'success', text: 'Active' };
      case 'inactive':
        return { color: 'default', text: 'Inactive' };
      case 'maintenance':
        return { color: 'warning', text: 'Maintenance' };
      default:
        return { color: 'default', text: 'Unknown' };
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  useEffect(() => {
    if (id) {
      fetchRouteDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!route) {
    return (
      <Card className="shadow-sm">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600">Route not found</h3>
          <Button 
            type="primary" 
            onClick={() => navigate('/stationAdmin/Routes')}
            className="mt-4"
          >
            Back to Routes
          </Button>
        </div>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(route.Status || 'active');
  const stations = route.Stations || ['Terminal A', 'Terminal B'];

  return (
    <div className="p-4 md:p-6">
      {/* Header with Back Button and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/stationAdmin/Routes')}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Route Details</h1>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Route Information */}
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex items-center mb-6">
              <Avatar 
                size={64}
                style={{ backgroundColor: '#722ed1' }}
                icon={<TbRoute />}
                className="mr-4"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-800 m-0">
                    {route.StartTerminal} → {route.EndTerminal}
                  </h2>
                  <Badge status={statusInfo.color as any} text={statusInfo.text} />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {route.Distance && (
                    <div className="flex items-center text-gray-600">
                      <TbRoute2 className="mr-2" />
                      <span>{route.Distance} km</span>
                    </div>
                  )}
                  {route.Duration && (
                    <div className="flex items-center text-gray-600">
                      <CiTimer className="mr-2" />
                      <span>{formatDuration(route.Duration)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Descriptions 
              title="Route Information" 
              bordered 
              column={{ xs: 1, sm: 2 }}
              size="middle"
            >
              <Descriptions.Item label="Start Terminal">
                <div className="flex items-center">
                  <CiLocationArrow1 className="mr-2 text-green-500" />
                  <span className="font-bold text-green-600">{route.StartTerminal}</span>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="End Terminal">
                <div className="flex items-center">
                  <CiLocationArrow1 className="mr-2 text-red-500" />
                  <span className="font-bold text-red-600">{route.EndTerminal}</span>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Status">
                <Badge status={statusInfo.color as any} text={statusInfo.text} />
              </Descriptions.Item>

              {route.Distance && (
                <Descriptions.Item label="Distance">
                  <div className="flex items-center">
                    <TbRoute2 className="mr-2 text-gray-400" />
                    <span>{route.Distance} kilometers</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.Duration && (
                <Descriptions.Item label="Duration">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    <span>{formatDuration(route.Duration)}</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.AssignedVehicles && (
                <Descriptions.Item label="Assigned Vehicles">
                  <div className="flex items-center">
                    <CarOutlined className="mr-2 text-gray-400" />
                    <span>{route.AssignedVehicles} vehicles</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.DailyTrips && (
                <Descriptions.Item label="Daily Trips">
                  <div className="flex items-center">
                    <ScheduleOutlined className="mr-2 text-gray-400" />
                    <span>{route.DailyTrips} trips/day</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.CreatedAt && (
                <Descriptions.Item label="Created Date" span={2}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400" />
                    <span>{new Date(route.CreatedAt).toLocaleDateString()}</span>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* Route Stations Timeline */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <RiRouteLine className="mr-2 text-purple-500" />
                Route Stations
              </h3>
              <Timeline mode="left">
                {stations.map((station, index) => (
                  <Timeline.Item
                    key={index}
                    color={index === 0 ? 'green' : index === stations.length - 1 ? 'red' : 'blue'}
                    dot={index === 0 ? <CiLocationArrow1 /> : index === stations.length - 1 ? <CiLocationArrow1 /> : <EnvironmentOutlined />}
                  >
                    <Card size="small" className="w-full max-w-xs">
                      <div className="font-medium">{station}</div>
                      <div className="text-xs text-gray-500">
                        {index === 0 ? route.StartTerminal : 
                         index === stations.length - 1 ? route.EndTerminal : 
                         'Intermediate Station'}
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </Card>
        </Col>

        {/* Right Column - Quick Actions & Stats */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-4">
            <h3 className="text-lg font-semibold mb-4">Route Statistics</h3>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6} lg={12}>
                <Statistic
                  title="Distance"
                  value={route.Distance || 0}
                  suffix="km"
                  prefix={<TbRoute2 />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={12} sm={6} lg={12}>
                <Statistic
                  title="Duration"
                  value={route.Duration || 0}
                  suffix="min"
                  prefix={<CiTimer />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6} lg={12}>
                <Statistic
                  title="Daily Trips"
                  value={route.DailyTrips || 0}
                  prefix={<ScheduleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6} lg={12}>
                <Statistic
                  title="Assigned Vehicles"
                  value={route.AssignedVehicles || 0}
                  prefix={<CarOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
            </Row>
          </Card>

          <Card className="shadow-sm mb-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button 
                type="primary" 
                block
                icon={<BarChartOutlined />}
                onClick={() => message.info('Route analytics coming soon')}
              >
                View Analytics
              </Button>
              
              <Button 
                block
                icon={<SafetyOutlined />}
                onClick={() => message.info('Schedule feature coming soon')}
              >
                Manage Schedule
              </Button>

              <Button 
                block
                icon={<TeamOutlined />}
                onClick={() => message.info('Vehicles feature coming soon')}
              >
                Assign Vehicles
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Route Safety Info</h3>
            <div className="space-y-3">
              {[
                { feature: 'Regular Maintenance', status: 'completed' },
                { feature: 'Driver Training', status: 'completed' },
                { feature: 'Safety Audit', status: 'pending' },
              ].map((info, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <SafetyOutlined className="mr-2 text-gray-400" />
                    <div className="text-sm">{info.feature}</div>
                  </div>
                  <Badge 
                    status={info.status === 'completed' ? 'success' : 'warning' as any}
                    text={info.status}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}