import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Select,
  DatePicker,
  Grid,
  Spin,
  Progress,
  Tag,
} from 'antd';
import {
  CarOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import { FaTaxi, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GrUserAdmin } from 'react-icons/gr';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

// Define types
type DashboardStats = {
  totalPassengers?: number;
  totalTaxis?: number;
  availableTaxis?: number;
  totalstations?: number;
  totalstationadmins?: number;
  totaldispachers?: number;
  totalroutes?: number;
  passengerChange?: number;
  taxiChange?: number;
  revenueChange?: number;
  activeTripsChange?: number;
  availableTaxisEachStation?: any[];
  passengerWaitingTrend?: any[];
};

type Station = {
  id: number;
  StationName: string;
  location: string;
  admins: number;
  dispatchers: number;
  taxis: number;
  queue: number;
  status: 'active' | 'inactive';
};

type ChartData = {
  name?: string;
  value?: number;
  [key: string]: any;
};

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedStation, setSelectedStation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const screens = useBreakpoint();

  // State for fetched data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [stations, setStations] = useState<Station[]>([]);

  // Chart data states
  const [passengerTrend, setPassengerTrend] = useState<ChartData[]>([]);
  const [stationPerformance, setStationPerformance] = useState<any[]>([]);
  const [stationPerformance2, setStationPerformance2] = useState<any[]>([]);

  const [passengerTaxiDistribution, setPassengerTaxiDistribution] = useState<
    ChartData[]
  >([]);
  const [taxisByStatus, setTaxisByStatus] = useState<ChartData[]>([]);

  // Colors for charts
  const CHART_COLORS = {
    primary: '#1890ff',
    secondary: '#52c41a',
    accent: '#722ed1',
    warning: '#fa8c16',
    error: '#f5222d',
    success: '#52c41a',
    info: '#1890ff',
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stations');
      setStations(response.data);

      // Generate chart data from stations
      generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  const fetchpassengers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/passengerqueue');
      setDashboardStats((prev) => ({
        ...prev,
        totalPassengers: response.data.total,
      }));

      // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchpassengers();
  }, []);

  const fetchtaxis = async () => {
    try {
      const response = await axios.get('http://localhost:5000/taxis/total');
      setDashboardStats((prev) => ({
        ...prev,
        totalTaxis: response.data.count,
      }));

      // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchtaxis();
  }, []);

  const fetchavailabletaxis = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/taxi-queue/total'
      );
      setDashboardStats((prev) => ({
        ...prev,
        availableTaxis: response.data.total,
      }));

      // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchavailabletaxis();
  }, []);

  const fetchTotalStations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stations/total');
      setDashboardStats((prev) => ({
        ...prev,
        totalstations: response.data.total,
      }));
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTotalStations();
  }, []);

  const fetchTotalStationAdmin = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/stationAdmins/total'
      );
      setDashboardStats((prev) => ({
        ...prev,
        totalstationadmins: response.data.total,
      }));
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTotalStationAdmin();
  }, []);

  const fetchTotalDispachers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/dispachers/total'
      );
      setDashboardStats((prev) => ({
        ...prev,
        totaldispachers: response.data.total,
      }));
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTotalDispachers();
  }, []);

  const fetchTotalRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/routes/total');
      setDashboardStats((prev) => ({
        ...prev,
        totalroutes: response.data.total,
      }));
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTotalRoutes();
  }, []);

  const fetchavailableTaxis = async () => {
    try {
      setLoading(true);
      const stationName = stations;
      if (!stationName) {
        console.warn('No station specified for fetching passengers');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/taxi-queue/availableTaxiForDashboard'
        // {
        //   params: { route: stationName },
        // }
      );

      console.log('✅ Fetched available taxis data:', response.data);

      setDashboardStats((prev) => ({
        ...prev,
        availableTaxisEachStation: response.data.map((item: any) => ({
          from_station: item.from_station,
          availableTaxiCount: Number(item.availableTaxiCount),
          waitingCount: Number(item.waitingCount),
        })),
      }));

      // setDashboardStats((prev) => ({
      //   ...prev,
      //   availableTaxisEachStation: response.data.total,
      // }));
    } catch (error) {
      console.error('Error fetching taxis:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(`dashboardStats ----------------->>>>>>>>>> `, dashboardStats);

  const stationPerformance3 = useMemo(() => {
    if (!dashboardStats.availableTaxisEachStation) return [];

    return dashboardStats.availableTaxisEachStation.map((item: any) => {
      const passengers = Number(item.waitingCount);
      const taxis = Number(item.availableTaxiCount);

      const efficiency =
        taxis === 0 ? 0 : Math.min((taxis / passengers) * 100, 100);

      return {
        name: item.from_station,
        passengers,
        taxis,
        efficiency: Number(efficiency.toFixed(1)),
      };
    });
  }, [dashboardStats.availableTaxisEachStation]);

  const fetchPassengerWaitingTrend = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/passengerqueue/passengerWaitingTrend'
      );

      setDashboardStats((prev) => ({
        ...prev,
        passengerWaitingTrend: Array.isArray(response.data)
          ? response.data
          : [],
      }));
    } catch (error) {
      console.error('Error fetching waiting trend:', error);
    }
  };

  useEffect(() => {
    fetchPassengerWaitingTrend();
  }, []);

  useEffect(() => {
    if (stations) {
      fetchavailableTaxis();
    }
  }, [stations]);
  const generateChartData = (stationsData: Station[]) => {
    if (!stationsData || stationsData.length === 0) {
      setStationPerformance([]);
      return;
    }

    const performanceData = stationsData.slice(0, 5).map((station) => ({
      name: station.StationName, // safe now
      passengers: station.queue ?? 0,
      taxis: station.taxis ?? 0,
      efficiency:
        station.queue > 0
          ? Math.round((station.taxis / station.queue) * 100)
          : 0,
    }));

    setStationPerformance(performanceData);
  };
  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (stations.length > 0) {
      generateChartData(stations);
    }
  }, [stations]);

  useEffect(() => {
    if (
      dashboardStats.totalPassengers !== undefined &&
      dashboardStats.availableTaxis !== undefined
    ) {
      setPassengerTaxiDistribution([
        {
          name: 'Passengers in Queue',
          value: dashboardStats.totalPassengers,
          color: CHART_COLORS.primary,
        },
        {
          name: 'Available Taxis',
          value: dashboardStats.availableTaxis,
          color: CHART_COLORS.success,
        },
      ]);
    }
  }, [dashboardStats.totalPassengers, dashboardStats.availableTaxis]);

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

  const safePieData = passengerTaxiDistribution.every((d) => d.value === 0)
    ? [{ name: 'No Data', value: 1, color: '#d9d9d9' }]
    : passengerTaxiDistribution;

  return (
    <div style={{ padding: screens.xs ? '16px' : '24px' }}>
      {/* Dashboard Filters */}
      <Card size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size="small">
              <Text strong>Time Range</Text>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: '100%' }}
                size={screens.xs ? 'small' : 'middle'}
              >
                <Option value="today">Today</Option>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="quarter">This Quarter</Option>
                <Option value="year">This Year</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size="small">
              <Text strong>Station Filter</Text>
              <Select
                value={selectedStation}
                onChange={setSelectedStation}
                style={{ width: '100%' }}
                size={screens.xs ? 'small' : 'middle'}
              >
                <Option value="all">All Stations</Option>
                {stations.map((station) => (
                  <Option key={station.id} value={station.id}>
                    {station.StationName}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" size="small">
              <Text strong>Date Range</Text>
              <RangePicker
                style={{ width: '100%' }}
                size={screens.xs ? 'small' : 'middle'}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Key Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Passengers"
              value={dashboardStats.totalPassengers}
              prefix={<FaUsers style={{ color: CHART_COLORS.primary }} />}
              loading={loadingStats}
              suffix={
                <Tag
                  color={
                    dashboardStats.passengerChange &&
                    dashboardStats.passengerChange > 0
                      ? 'success'
                      : 'error'
                  }
                  icon={
                    dashboardStats.passengerChange &&
                    dashboardStats.passengerChange > 0 ? (
                      <RiseOutlined />
                    ) : (
                      <FallOutlined />
                    )
                  }
                >
                  {dashboardStats.passengerChange || 0}%
                </Tag>
              }
            />
            <Progress
              percent={Math.min(
                100,
                ((dashboardStats.totalPassengers || 0) / 1000) * 100
              )}
              size="small"
              status="active"
              strokeColor={CHART_COLORS.primary}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Registered Taxis"
              value={dashboardStats.totalTaxis || 0}
              prefix={<FaTaxi style={{ color: CHART_COLORS.success }} />}
              loading={loadingStats}
            />
            <Progress
              percent={Math.min(
                100,
                ((dashboardStats.totalTaxis || 0) / 300) * 100
              )}
              size="small"
              status="active"
              strokeColor={CHART_COLORS.success}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Station admins"
              value={dashboardStats.totalstationadmins || 0}
              prefix={<GrUserAdmin style={{ color: 'red' }} />}
            />
            <Progress
              percent={Math.min(
                100,
                ((dashboardStats.totalstationadmins || 0) / 300) * 100
              )}
              size="small"
              status="active"
              strokeColor={CHART_COLORS.success}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Stations"
              value={dashboardStats.totalstations || 0}
              prefix={
                <EnvironmentOutlined style={{ color: CHART_COLORS.info }} />
              }
            />
            <Progress
              percent={Math.min(
                100,
                ((dashboardStats.totalstations || 0) / 300) * 100
              )}
              size="small"
              status="active"
              strokeColor={CHART_COLORS.success}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Passenger Trend Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <Text strong>Passenger Trend (Last 7 Days)</Text>
              </Space>
            }
            extra={
              <Select size="small" defaultValue="week" style={{ width: 100 }}>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
              </Select>
            }
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardStats.passengerWaitingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* <XAxis 
                      dataKey="time"
                      
                    /> */}
                  {/* <XAxis
                    dataKey="time"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                  /> */}

                  <XAxis
                    dataKey="time"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                    minTickGap={30}
                  />

                  <YAxis />
                  <RechartsTooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="totalWaiting"
                    name="Passengers Waiting"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Station Performance Chart */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <Text strong>Top Station Performance</Text>
              </Space>
            }
            extra={
              <Button type="link" size="small">
                View All
              </Button>
            }
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationPerformance3}>
                  {/* <BarChart data={stationPerformance}> */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="passengers"
                    name="Passengers in Queue"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="taxis"
                    name="Available Taxis"
                    fill={CHART_COLORS.success}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="efficiency"
                    name="Efficiency %"
                    fill={CHART_COLORS.accent}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Distribution Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Queue Distribution Chart */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <Text strong>Passengers vs Available Taxis</Text>
              </Space>
            }
          >
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passengerTaxiDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {passengerTaxiDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                    {safePieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Text strong>
                Total Passengers: {dashboardStats.totalPassengers || 0}
              </Text>
              <br />
              <Text strong>
                Available Taxis: {dashboardStats.availableTaxis || 0}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Space>
                <CarOutlined />
                <Text strong>Taxis Status</Text>
              </Space>
            }
          >
            <div style={{ marginBottom: '20px' }}>
              <Space
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <Text strong>Taxis Available</Text>
                <Text>
                  {dashboardStats.availableTaxis || 0}
                  {/* {taxisByStatus.find(t => t.name === 'Available')?.value || 0} / {dashboardStats.totalTaxis || 0} */}
                </Text>
              </Space>
              <Progress
                percent={Math.min(
                  100,
                  ((dashboardStats.availableTaxis || 0) / 300) * 100
                )}
                size="small"
                status="active"
                strokeColor={CHART_COLORS.success}
              />
            </div>

            {/* Taxis in Queue (On Trip) */}
            <div style={{ marginBottom: '20px' }}>
              <Space
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <Text strong>Taxis Unavailable</Text>
                <Text strong>
                  {dashboardStats.totalTaxis && dashboardStats.availableTaxis
                    ? dashboardStats.totalTaxis - dashboardStats.availableTaxis
                    : 0}
                </Text>
              </Space>
              <Progress
                percent={
                  dashboardStats.totalTaxis && dashboardStats.availableTaxis
                    ? Math.round(
                        ((dashboardStats.totalTaxis -
                          dashboardStats.availableTaxis) /
                          dashboardStats.totalTaxis) *
                          100
                      )
                    : 0
                }
                size="small"
                strokeColor={CHART_COLORS.warning}
              />
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Text type="secondary">
                Total: {dashboardStats.totalTaxis || 0} taxis
              </Text>
            </div>
          </Card>
        </Col>

        {/* Station Status Overview */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <Text strong>Station Status</Text>
              </Space>
            }
          >
            <div style={{ padding: '16px' }}>
              {['active', 'inactive'].map((status) => {
                const count = stations.filter(
                  (s) => s.status === status
                ).length;
                const percentage =
                  stations.length > 0 ? (count / stations.length) * 100 : 0;
                const color =
                  status === 'active'
                    ? CHART_COLORS.success
                    : status === 'busy'
                    ? CHART_COLORS.warning
                    : CHART_COLORS.error;

                return (
                  <div key={status} style={{ marginBottom: '16px' }}>
                    <Space
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}
                    >
                      <Text strong style={{ textTransform: 'capitalize' }}>
                        {status}
                      </Text>
                      <Text strong>{count} stations</Text>
                    </Space>
                    <Progress
                      percent={Math.round(percentage)}
                      strokeColor={color}
                      size="small"
                      showInfo={false}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Space>
                <AreaChartOutlined />
                <Text strong>Data</Text>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f6ffed',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ color: CHART_COLORS.success }}>
                  Total Routes
                </Text>
                <Title level={3} style={{ margin: '8px 0' }}>
                  {' '}
                  {dashboardStats.totalroutes || 0}
                </Title>
              </div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#e6f7ff',
                  borderRadius: '8px',
                }}
              >
                <Text strong style={{ color: CHART_COLORS.primary }}>
                  Total Dispachers
                </Text>
                <Title level={3} style={{ margin: '8px 0' }}>
                  {' '}
                  {dashboardStats.totaldispachers || 0}
                </Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
