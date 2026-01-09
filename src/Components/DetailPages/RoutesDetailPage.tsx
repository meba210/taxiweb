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
  Timeline,
} from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { TbRoute, TbRoute2 } from 'react-icons/tb';
import { RiRouteLine } from 'react-icons/ri';
import { CiLocationArrow1, CiTimer } from 'react-icons/ci';
import axios from 'axios';

type Route = {
  id: number;

  station_name?: string;
  EndTerminal: string;
  Distance?: number;
  Duration?: number;
  Status?: 'active' | 'inactive';
  AssignedVehicles?: number;
  DailyTrips?: number;
  CreatedAt?: string;
  Stations?: string[];
  StartTerminal?: string;
};

export default function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchRouteDetails = async () => {
    if (!token) {
      message.error('Authentication required. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let routeData: Route | null = null;

      if (Array.isArray(response.data)) {
        if (response.data.length > 0) {
          routeData = response.data[0];
        }
      } else {
        routeData = response.data;
      }

      if (routeData) {
        const mappedData: Route = {
          station_name:
            routeData.station_name || routeData.StartTerminal || 'Main Station',
          // EndTerminal: routeData.EndTerminal || "Unknown Destination",
          Distance: routeData.Distance,
          Duration: routeData.Duration,
          Status: routeData.Status || 'active',
          AssignedVehicles: routeData.AssignedVehicles,
          DailyTrips: routeData.DailyTrips,
          CreatedAt: routeData.CreatedAt,
          Stations: routeData.Stations,

          ...routeData,
        };

        setRoute(mappedData);
      }
    } catch (error: any) {
      console.error('Error fetching route details:', error);
      message.error(
        error.response?.data?.message || 'Failed to load route details'
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
      default:
        return { color: 'default', text: 'Unknown' };
    }
  };

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
      <div className="p-4 md:p-6 lg:p-8">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!route) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Card className="shadow-sm">
          <div className="text-center py-8 md:py-12">
            <h3 className="text-lg md:text-xl font-semibold text-gray-600">
              Route not found
            </h3>
            <Button
              type="primary"
              onClick={() => navigate('/stationAdmin/Routes')}
              className="mt-4"
              size="middle"
            >
              Back to Routes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(route.Status || 'active');
  const stations = route.Stations || [
    route.station_name || 'Main Station',
    route.EndTerminal,
  ];

  const startTerminal =
    route.station_name || route.StartTerminal || 'Main Station';

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 md:mb-6 gap-3 xs:gap-4">
        <div className="flex items-center flex-wrap gap-2 xs:gap-0">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/stationAdmin/Routes')}
            className="mr-2 xs:mr-4"
            size="middle"
          >
            <span className="hidden xs:inline">Back</span>
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Route Details
          </h1>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="shadow-sm" bodyStyle={{ padding: '16px' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <Avatar
                size={{ xs: 56, sm: 60, md: 64 }}
                style={{ backgroundColor: '#722ed1' }}
                icon={<TbRoute />}
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                    {startTerminal} → {route.EndTerminal}
                  </h2>
                  <Badge
                    status={statusInfo.color as any}
                    text={
                      <span className="text-xs sm:text-sm">
                        {statusInfo.text}
                      </span>
                    }
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                  {route.Distance && (
                    <div className="flex items-center text-gray-600 text-sm md:text-base">
                      <TbRoute2 className="mr-1 md:mr-2 flex-shrink-0" />
                      <span>{route.Distance} km</span>
                    </div>
                  )}
                  {route.Duration && (
                    <div className="flex items-center text-gray-600 text-sm md:text-base">
                      <CiTimer className="mr-1 md:mr-2 flex-shrink-0" />
                      <span>{formatDuration(route.Duration)}</span>
                    </div>
                  )}
                  {route.id && (
                    <Tag color="blue" className="text-xs md:text-sm">
                      #{route.id}
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            <Descriptions
              title="Route Information"
              bordered
              column={{ xs: 1, sm: 2, md: 2 }}
              size="middle"
              labelStyle={{
                fontWeight: '600',
                backgroundColor: '#fafafa',
                width: 'auto',
              }}
            >
              <Descriptions.Item label="Start Terminal (Station)">
                <div className="flex items-center">
                  <CiLocationArrow1 className="mr-2 text-green-500 flex-shrink-0" />
                  <span className="font-bold text-green-600 truncate">
                    {startTerminal}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="End Terminal">
                <div className="flex items-center">
                  <CiLocationArrow1 className="mr-2 text-red-500 flex-shrink-0" />
                  <span className="font-bold text-red-600 truncate">
                    {route.EndTerminal}
                  </span>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Badge
                  status={statusInfo.color as any}
                  text={statusInfo.text}
                />
              </Descriptions.Item>

              {route.Distance && (
                <Descriptions.Item label="Distance">
                  <div className="flex items-center">
                    <TbRoute2 className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{route.Distance} kilometers</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.Duration && (
                <Descriptions.Item label="Duration">
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{formatDuration(route.Duration)}</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.AssignedVehicles && (
                <Descriptions.Item label="Assigned Vehicles">
                  <div className="flex items-center">
                    <CarOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{route.AssignedVehicles} vehicles</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.DailyTrips && (
                <Descriptions.Item label="Daily Trips">
                  <div className="flex items-center">
                    <ScheduleOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{route.DailyTrips} trips/day</span>
                  </div>
                </Descriptions.Item>
              )}

              {route.CreatedAt && (
                <Descriptions.Item label="Created Date" span={2}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>
                      {new Date(route.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider className="my-4 sm:my-6" />

            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                <RiRouteLine className="mr-2 text-purple-500 flex-shrink-0" />
                Route Path
              </h3>
              <div className="overflow-x-auto">
                <Timeline mode="left" className="min-w-min">
                  {stations.map((station, index) => (
                    <Timeline.Item
                      key={index}
                      color={
                        index === 0
                          ? 'green'
                          : index === stations.length - 1
                          ? 'red'
                          : 'blue'
                      }
                      dot={
                        index === 0 ? (
                          <CiLocationArrow1 />
                        ) : index === stations.length - 1 ? (
                          <CiLocationArrow1 />
                        ) : (
                          <EnvironmentOutlined />
                        )
                      }
                    >
                      <Card
                        size="small"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                      >
                        <div className="font-medium truncate">{station}</div>
                        <div className="text-xs text-gray-500">
                          {index === 0
                            ? 'Start Station'
                            : index === stations.length - 1
                            ? 'End Terminal'
                            : 'Intermediate Station'}
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
