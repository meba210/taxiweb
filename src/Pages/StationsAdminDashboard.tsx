import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Select,
  Grid,
  Spin,
  Tag,
  Avatar,
  message,
  DatePicker,
} from 'antd';
import {
  TeamOutlined,
  EnvironmentOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { FaTaxi, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PiHandWaving } from 'react-icons/pi';
import { IoMdPerson } from 'react-icons/io';
import { CiRoute } from 'react-icons/ci';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const CHART_COLORS = {
  primary: '#1890ff',
  secondary: '#52c41a',
  accent: '#722ed1',
  warning: '#fa8c16',
  error: '#f5222d',
  success: '#52c41a',
  info: '#13c2c2',
  purple: '#722ed1',
};

type StationStats = {
  passengersQueue?: number;
  totalTaxis?: number;
  availableTaxis?: number;
  totaldispachers?: number;
  totalroutes?: number;
  passengerWaitingTrend?: any[];
  passengerWaitingByDestination?: any[];
};

const StationsAdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const screens = useBreakpoint();
  const token = localStorage.getItem('token');

  const [stations, setStations] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [stationStats, setStationStats] = useState<StationStats>({});
  const [filteredData, setFilteredData] = useState<StationStats>({});
  const [dates, setDates] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  const colors = [
    '#8884d8',
    '#1890ff',
    '#52c41a',
    '#ff7f50',
    '#a4de6c',
    '#8dd1e1',
    '#d0ed57',
  ];

  const fetchAssignedStation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('No token found');
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/stationAdmins/stationadmin-stations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStations(res.data.station);
      setName(res.data.name);
    } catch (err: any) {
      console.error(err);
      message.error('Failed to fetch assigned route');
    }
  };

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/routes/stationRoutes',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setRoutes(response.data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  // Fetch all station data
  const fetchAllStationData = async () => {
    if (!stations) return;

    setDataLoading(true);
    try {
      // Fetch passengers queue
      const passengersRes = await axios.get(
        'http://localhost:5000/passengerqueue/eachstation',
        {
          params: { route: stations },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch total taxis
      const taxisRes = await axios.get(
        'http://localhost:5000/taxis/eachstation',
        {
          params: { route: stations },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch available taxis
      const availableTaxisRes = await axios.get(
        'http://localhost:5000/taxi-queue/availableTaxiseachstation',
        {
          params: { route: stations },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch total dispatchers
      const dispatchersRes = await axios.get(
        'http://localhost:5000/dispachers/dispachersEachStation',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch total routes
      const routesRes = await axios.get(
        'http://localhost:5000/routes/routesEachStation',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch passenger waiting trend
      const waitingTrendRes = await axios.get(
        'http://localhost:5000/passengerqueue/passengerWaitingTrendStation',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch passenger waiting by destination
      const waitingByDestinationRes = await axios.get(
        'http://localhost:5000/passengerqueue/passengerWaitingByDestination',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const destinationData = Array.isArray(waitingByDestinationRes.data)
        ? waitingByDestinationRes.data
        : [];
      const uniqueDates = [...new Set(destinationData.map((d: any) => d.date))];
      setDates(uniqueDates);

      const chartData = destinationData.reduce((acc: any[], curr: any) => {
        let routeObj = acc.find((r: any) => r.route === curr.route);
        if (!routeObj) {
          routeObj = { route: curr.route };
          acc.push(routeObj);
        }
        routeObj[curr.date] = curr.totalWaiting;
        return acc;
      }, []);

      const newStats = {
        passengersQueue: passengersRes.data.total,
        totalTaxis: taxisRes.data.total,
        availableTaxis: availableTaxisRes.data.total,
        totaldispachers: dispatchersRes.data.total,
        totalroutes: routesRes.data.total,
        passengerWaitingTrend: Array.isArray(waitingTrendRes.data)
          ? waitingTrendRes.data
          : [],
        passengerWaitingByDestination: chartData,
      };

      setStationStats(newStats);
      setFilteredData(newStats);
    } catch (error) {
      console.error('Error fetching station data:', error);
      message.error('Failed to load station data');
    } finally {
      setDataLoading(false);
    }
  };

  const fetchRouteData = async (routeName: string) => {
    if (!stations || routeName === 'all') {
      await fetchAllStationData();
      return;
    }

    setDataLoading(true);
    try {
      // Fetch passengers queue for specific route
      const passengersRes = await axios.get(
        `http://localhost:5000/passengerqueue/eachstation/route/${routeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch taxis for specific route
      const taxisRes = await axios.get(
        `http://localhost:5000/taxis/eachstation/route/${routeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch available taxis for specific route
      const availableTaxisRes = await axios.get(
        `http://localhost:5000/taxi-queue/availableTaxiseachstation/route/${routeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch passenger waiting trend for specific route
      const waitingTrendRes = await axios.get(
        `http://localhost:5000/passengerqueue/passengerWaitingTrendStation/route/${routeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch passenger waiting by destination for specific route
      const waitingByDestinationRes = await axios.get(
        `http://localhost:5000/passengerqueue/passengerWaitingByDestination/route/${routeName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const destinationData = Array.isArray(waitingByDestinationRes.data)
        ? waitingByDestinationRes.data
        : [];
      const uniqueDates = [...new Set(destinationData.map((d: any) => d.date))];
      setDates(uniqueDates);

      const chartData = destinationData.reduce((acc: any[], curr: any) => {
        let routeObj = acc.find((r: any) => r.route === curr.route);
        if (!routeObj) {
          routeObj = { route: curr.route };
          acc.push(routeObj);
        }
        routeObj[curr.date] = curr.totalWaiting;
        return acc;
      }, []);

      const routeStats = {
        passengersQueue: passengersRes.data?.total || 0,
        totalTaxis: taxisRes.data?.total || 0,
        availableTaxis: availableTaxisRes.data?.total || 0,
        totaldispachers: stationStats.totaldispachers,
        totalroutes: stationStats.totalroutes,
        passengerWaitingTrend: Array.isArray(waitingTrendRes.data)
          ? waitingTrendRes.data
          : [],
        passengerWaitingByDestination: chartData,
      };

      setFilteredData(routeStats);
    } catch (error) {
      console.error('Error fetching route data:', error);

      filterExistingData(routeName);
    } finally {
      setDataLoading(false);
    }
  };

  const filterExistingData = (routeName: string) => {
    const filteredDestination =
      stationStats.passengerWaitingByDestination?.filter(
        (item: any) => item.route === routeName
      ) || [];

    const routePassengers = filteredDestination.reduce((total, item) => {
      const datesTotal = Object.values(item).reduce((sum: number, val: any) => {
        return typeof val === 'number' ? sum + val : sum;
      }, 0);
      return total + datesTotal;
    }, 0);

    setFilteredData({
      ...stationStats,
      passengersQueue: routePassengers,
      passengerWaitingByDestination: filteredDestination,
    });
  };

  // Calculate efficiency
  const passengers = filteredData.passengersQueue ?? 0;
  const taxis = filteredData.totalTaxis ?? 0;
  const efficiency =
    taxis === 0
      ? 0
      : Number(
          Math.min((taxis / Math.max(passengers, 1)) * 100, 100).toFixed(2)
        );

  // Initial data fetch
  useEffect(() => {
    fetchAssignedStation();
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (stations) {
      fetchAllStationData();
    }
  }, [stations]);

  // Apply date range filter
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      const filteredTrend =
        stationStats.passengerWaitingTrend?.filter((item: any) => {
          if (!item.time) return false;
          const itemDate = dayjs(item.time);
          return itemDate.isAfter(start) && itemDate.isBefore(end);
        }) || [];

      setFilteredData((prev) => ({
        ...prev,
        passengerWaitingTrend: filteredTrend,
      }));
    } else {
      setFilteredData((prev) => ({
        ...prev,
        passengerWaitingTrend: stationStats.passengerWaitingTrend || [],
      }));
    }
  }, [dateRange, stationStats.passengerWaitingTrend]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: screens.xs ? '12px' : screens.sm ? '16px' : '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: screens.xs ? 16 : 24 }}>
        <Col xs={24}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #acbaf7ff 0%, #667eea 0% )',
              color: 'white',
              borderRadius: '12px',
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <Space>
                    <Avatar
                      size={screens.xs ? 40 : screens.md ? 50 : 64}
                      icon={<EnvironmentOutlined />}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                      }}
                    />
                    <div>
                      <Title
                        level={screens.xs ? 4 : screens.sm ? 3 : 2}
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: screens.xs
                            ? '18px'
                            : screens.sm
                            ? '22px'
                            : '28px',
                        }}
                      >
                        {stations || 'Loading Station...'}
                      </Title>
                    </div>
                  </Space>

                  <Space wrap>
                    <Tag
                      color="green"
                      style={{
                        borderColor: 'white',
                        color: 'white',
                        background: 'rgba(255,255,255,0.2)',
                        fontSize: screens.xs ? '11px' : '12px',
                      }}
                    >
                      <CheckCircleOutlined /> Active
                    </Tag>
                    <Tag
                      color="purple"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderColor: 'white',
                        color: 'white',
                        background: 'rgba(255,255,255,0.2)',
                        fontSize: screens.xs ? '11px' : '12px',
                      }}
                    >
                      <PiHandWaving /> Hello ! {name}
                    </Tag>
                  </Space>
                </Space>
              </Col>

              <Col xs={24} md={8}>
                <Row gutter={[8, 8]}>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: screens.xs ? '8px' : '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <Title
                        level={screens.xs ? 5 : screens.sm ? 4 : 3}
                        style={{ color: 'white', margin: 0 }}
                      >
                        {filteredData.passengersQueue || '0'}
                      </Title>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: screens.xs ? '10px' : '12px',
                        }}
                      >
                        In Queue
                      </Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: screens.xs ? '8px' : '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <Title
                        level={screens.xs ? 5 : screens.sm ? 4 : 3}
                        style={{ color: 'white', margin: 0 }}
                      >
                        {filteredData.totalTaxis || '0'}
                      </Title>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: screens.xs ? '10px' : '12px',
                        }}
                      >
                        Taxis
                      </Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: screens.xs ? '8px' : '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <Title
                        level={screens.xs ? 5 : screens.sm ? 4 : 3}
                        style={{ color: 'white', margin: 0 }}
                      >
                        {filteredData.totaldispachers || '0'}
                      </Title>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: screens.xs ? '10px' : '12px',
                        }}
                      >
                        Dispatchers
                      </Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: screens.xs ? '8px' : '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <Title
                        level={screens.xs ? 5 : screens.sm ? 4 : 3}
                        style={{ color: 'white', margin: 0 }}
                      >
                        {efficiency}%
                      </Title>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: screens.xs ? '10px' : '12px',
                        }}
                      >
                        Efficiency
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: screens.xs ? 16 : 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px' }}>
            <Statistic
              title="Passengers InQueue"
              value={filteredData.passengersQueue || 0}
              prefix={<FaUsers style={{ color: CHART_COLORS.primary }} />}
              valueStyle={{ fontSize: screens.xs ? '20px' : '28px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px' }}>
            <Statistic
              title="Available Taxis"
              value={filteredData.availableTaxis || 0}
              prefix={<FaTaxi style={{ color: CHART_COLORS.success }} />}
              suffix={`/ ${filteredData.totalTaxis || 0}`}
              valueStyle={{ fontSize: screens.xs ? '20px' : '28px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px' }}>
            <Statistic
              title="Total Routes"
              value={filteredData.totalroutes || 0}
              prefix={<CiRoute className="text-blue-500" />}
              valueStyle={{ fontSize: screens.xs ? '20px' : '28px' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: '8px' }}>
            <Statistic
              title="Total Dispatchers"
              value={filteredData.totaldispachers || 0}
              prefix={<IoMdPerson style={{ color: 'red' }} />}
              valueStyle={{ fontSize: screens.xs ? '20px' : '28px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Charts Section - Fourth Row (First chart full width) */}
      <Row gutter={[16, 16]} style={{ marginBottom: screens.xs ? 16 : 24 }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <Text strong>Passenger & Queue Trend by Destination</Text>
              </Space>
            }
            extra={
              <Tag color="blue">
                {selectedRoute === 'all' ? 'All Routes' : selectedRoute}
              </Tag>
            }
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: screens.xs ? 250 : 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData.passengerWaitingByDestination}
                  margin={{
                    top: 20,
                    right: screens.xs ? 10 : 30,
                    left: screens.xs ? 0 : 20,
                    bottom: screens.xs ? 40 : 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="route"
                    angle={screens.xs ? -45 : 0}
                    textAnchor={screens.xs ? 'end' : 'middle'}
                    height={screens.xs ? 80 : 60}
                    fontSize={screens.xs ? 10 : 12}
                  />
                  <YAxis fontSize={screens.xs ? 10 : 12} />
                  <RechartsTooltip />
                  <Legend
                    wrapperStyle={{
                      paddingTop: screens.xs ? 10 : 0,
                      fontSize: screens.xs ? 10 : 12,
                    }}
                  />
                  {dates.map((date, index) => (
                    <Bar
                      key={date}
                      dataKey={date}
                      name={date}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Queue Throughout Day */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <ScheduleOutlined />
                <Text strong>Queue Throughout the Day</Text>
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <div style={{ height: screens.xs ? 250 : 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData.passengerWaitingTrend}
                  margin={{
                    top: 20,
                    right: screens.xs ? 10 : 30,
                    left: screens.xs ? 0 : 20,
                    bottom: screens.xs ? 40 : 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                    minTickGap={screens.xs ? 80 : 40}
                    fontSize={screens.xs ? 10 : 12}
                  />
                  <YAxis fontSize={screens.xs ? 10 : 12} />
                  <RechartsTooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: screens.xs ? 10 : 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalWaiting"
                    name="Passengers Waiting"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ r: screens.xs ? 2 : 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StationsAdminDashboard;
