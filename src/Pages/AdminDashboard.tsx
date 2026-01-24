import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Select,
  DatePicker,
  Grid,
  Spin,
  Progress,
  Tag,
  message,
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
import dayjs, { Dayjs } from 'dayjs';

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
  filteredData?: {
    totalPassengers?: number;
    availableTaxis?: number;
    passengerWaitingTrend?: any[];
    availableTaxisEachStation?: any[];
  };
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

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedStation, setSelectedStation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const screens = useBreakpoint();

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStats, setFilteredStats] = useState<DashboardStats>({});
  const [filteredPassengerTrend, setFilteredPassengerTrend] = useState<any[]>(
    []
  );

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
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const fetchAllData = async () => {
    setLoadingStats(true);
    try {
      const passengersRes = await axios.get(
        'http://localhost:5000/passengerqueue'
      );

      const taxisRes = await axios.get('http://localhost:5000/taxis/total');

      const availableTaxisRes = await axios.get(
        'http://localhost:5000/taxi-queue/total'
      );

      const stationsRes = await axios.get(
        'http://localhost:5000/stations/total'
      );

      const stationAdminsRes = await axios.get(
        'http://localhost:5000/stationAdmins/total'
      );

      const dispatchersRes = await axios.get(
        'http://localhost:5000/dispachers/total'
      );

      const routesRes = await axios.get('http://localhost:5000/routes/total');

      const waitingTrendRes = await axios.get(
        'http://localhost:5000/passengerqueue/passengerWaitingTrend'
      );

      const availableByStationRes = await axios.get(
        'http://localhost:5000/taxi-queue/availableTaxiForDashboard'
      );

      const passengerTrendData = Array.isArray(waitingTrendRes.data)
        ? waitingTrendRes.data
        : [];

      setDashboardStats({
        totalPassengers: passengersRes.data.total,
        totalTaxis: taxisRes.data.count,
        availableTaxis: availableTaxisRes.data.total,
        totalstations: stationsRes.data.total,
        totalstationadmins: stationAdminsRes.data.total,
        totaldispachers: dispatchersRes.data.total,
        totalroutes: routesRes.data.total,
        passengerWaitingTrend: passengerTrendData,
        availableTaxisEachStation: availableByStationRes.data.map(
          (item: any) => ({
            from_station: item.from_station,
            availableTaxiCount: Number(item.availableTaxiCount),
            waitingCount: Number(item.waitingCount),
          })
        ),
      });

      setFilteredPassengerTrend(passengerTrendData);

      setFilteredStats({
        totalPassengers: passengersRes.data.total,
        availableTaxis: availableTaxisRes.data.total,
        passengerWaitingTrend: passengerTrendData,
        availableTaxisEachStation: availableByStationRes.data.map(
          (item: any) => ({
            from_station: item.from_station,
            availableTaxiCount: Number(item.availableTaxiCount),
            waitingCount: Number(item.waitingCount),
          })
        ),
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  const fetchStationData = async (stationId: string) => {
    setLoadingStats(true);
    try {
      const station = stations.find((s) => s.id.toString() === stationId);
      if (!station) {
        return;
      }

      const stationName = station.StationName;

      const passengersRes = await axios.get(
        `http://localhost:5000/passengerqueue/station/${stationName}`
      );

      const availableTaxisRes = await axios.get(
        `http://localhost:5000/taxi-queue/station/${stationName}`
      );

      const waitingTrendRes = await axios.get(
        `http://localhost:5000/passengerqueue/station/${stationName}/trend`
      );

      const availableByStationRes = await axios.get(
        `http://localhost:5000/taxi-queue/station/${stationName}/dashboard`
      );

      const stationTrendData = Array.isArray(waitingTrendRes.data)
        ? waitingTrendRes.data
        : [];

      setFilteredStats({
        totalPassengers: passengersRes.data.total || 0,
        availableTaxis: availableTaxisRes.data.total || 0,
        passengerWaitingTrend: stationTrendData,
        availableTaxisEachStation: Array.isArray(availableByStationRes.data)
          ? availableByStationRes.data.map((item: any) => ({
              from_station: item.from_station,
              availableTaxiCount: Number(item.availableTaxiCount),
              waitingCount: Number(item.waitingCount),
            }))
          : [],
      });

      if (dateRange && dateRange[0] && dateRange[1]) {
        const filtered = filterTrendByDateRange(
          stationTrendData,
          dateRange[0],
          dateRange[1]
        );
        setFilteredPassengerTrend(filtered);
      } else {
        setFilteredPassengerTrend(stationTrendData);
      }
    } catch (error) {
      console.error('Error fetching station data:', error);

      filterExistingData(stationId);
    } finally {
      setLoadingStats(false);
    }
  };

  const filterExistingData = (stationId: string) => {
    const station = stations.find((s) => s.id.toString() === stationId);
    if (!station) return;

    const stationName = station.StationName;

    const filteredAvailableTaxis =
      dashboardStats.availableTaxisEachStation?.filter(
        (item) => item.from_station === stationName
      ) || [];

    const stationPassengers = filteredAvailableTaxis.reduce(
      (sum, item) => sum + (item.waitingCount || 0),
      0
    );

    const stationAvailableTaxis = filteredAvailableTaxis.reduce(
      (sum, item) => sum + (item.availableTaxiCount || 0),
      0
    );

    const allTrend = dashboardStats.passengerWaitingTrend || [];

    setFilteredStats({
      totalPassengers: stationPassengers,
      availableTaxis: stationAvailableTaxis,
      passengerWaitingTrend: allTrend,
      availableTaxisEachStation: filteredAvailableTaxis,
    });

    if (dateRange && dateRange[0] && dateRange[1]) {
      const filtered = filterTrendByDateRange(
        allTrend,
        dateRange[0],
        dateRange[1]
      );
      setFilteredPassengerTrend(filtered);
    } else {
      setFilteredPassengerTrend(allTrend);
    }
  };

  const handleStationChange = (value: string) => {
    setSelectedStation(value);
    if (value === 'all') {
      setFilteredStats({
        totalPassengers: dashboardStats.totalPassengers,
        availableTaxis: dashboardStats.availableTaxis,
        passengerWaitingTrend: dashboardStats.passengerWaitingTrend,
        availableTaxisEachStation: dashboardStats.availableTaxisEachStation,
      });

      if (dateRange && dateRange[0] && dateRange[1]) {
        const filtered = filterTrendByDateRange(
          dashboardStats.passengerWaitingTrend || [],
          dateRange[0],
          dateRange[1]
        );
        setFilteredPassengerTrend(filtered);
      } else {
        setFilteredPassengerTrend(dashboardStats.passengerWaitingTrend || []);
      }
    } else {
      fetchStationData(value);
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setDateRange(dates);

    if (!dates || !dates[0] || !dates[1]) {
      if (selectedStation === 'all') {
        setFilteredPassengerTrend(dashboardStats.passengerWaitingTrend || []);
      } else {
        setFilteredPassengerTrend(filteredStats.passengerWaitingTrend || []);
      }
      return;
    }

    let dataToFilter: any[] = [];
    if (selectedStation === 'all') {
      dataToFilter = dashboardStats.passengerWaitingTrend || [];
    } else {
      dataToFilter = filteredStats.passengerWaitingTrend || [];
    }

    const filtered = filterTrendByDateRange(dataToFilter, dates[0], dates[1]);
    setFilteredPassengerTrend(filtered);
  };

  const filterTrendByDateRange = (
    data: any[],
    startDate: Dayjs,
    endDate: Dayjs
  ) => {
    if (!data || data.length === 0) return [];

    return data.filter((item) => {
      if (!item.time) return false;
      const itemDate = dayjs(item.time);
      return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
    });
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);

    let startDate: Dayjs;
    let endDate: Dayjs = dayjs();

    switch (value) {
      case 'today':
        startDate = dayjs().startOf('day');
        break;
      case 'week':
        startDate = dayjs().subtract(7, 'day');
        break;
      case 'month':
        startDate = dayjs().subtract(1, 'month');
        break;
      case 'quarter':
        startDate = dayjs().subtract(3, 'month');
        break;
      case 'year':
        startDate = dayjs().subtract(1, 'year');
        break;
      default:
        startDate = dayjs().subtract(7, 'day');
    }

    const newDateRange: [Dayjs, Dayjs] = [startDate, endDate];
    setDateRange(newDateRange);

    handleDateRangeChange(newDateRange);
  };

  const stationPerformance3 = useMemo(() => {
    const dataSource =
      selectedStation === 'all'
        ? dashboardStats.availableTaxisEachStation
        : filteredStats.availableTaxisEachStation;

    if (!dataSource || dataSource.length === 0) return [];

    return dataSource.map((item: any) => {
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
  }, [
    selectedStation,
    dashboardStats.availableTaxisEachStation,
    filteredStats.availableTaxisEachStation,
  ]);

  const filteredPassengerTaxiDistribution = useMemo(() => {
    const passengers =
      selectedStation === 'all'
        ? dashboardStats.totalPassengers
        : filteredStats.totalPassengers;
    const taxis =
      selectedStation === 'all'
        ? dashboardStats.availableTaxis
        : filteredStats.availableTaxis;

    return [
      {
        name: 'Passengers in Queue',
        value: passengers || 0,
        color: CHART_COLORS.primary,
      },
      {
        name: 'Available Taxis',
        value: taxis || 0,
        color: CHART_COLORS.success,
      },
    ];
  }, [selectedStation, dashboardStats, filteredStats]);

  const formatDateRange = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      return 'All Time';
    }
    return `${dateRange[0].format('MMM D, YYYY')} - ${dateRange[1].format(
      'MMM D, YYYY'
    )}`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchStations();
      await fetchAllData();
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    handleTimeRangeChange('week');
  }, []);

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

  const safePieData = filteredPassengerTaxiDistribution.every(
    (d) => d.value === 0
  )
    ? [{ name: 'No Data', value: 1, color: '#d9d9d9' }]
    : filteredPassengerTaxiDistribution;

  const displayData =
    selectedStation === 'all' ? dashboardStats : filteredStats;

  return (
    <div style={{ padding: screens.xs ? '16px' : '24px' }}>
      <Card size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size="small">
              <Text strong>Time Range</Text>
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
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
                onChange={handleStationChange}
                style={{ width: '100%' }}
                size={screens.xs ? 'small' : 'middle'}
                loading={loading}
              >
                <Option value="all">All Stations</Option>
                {stations.map((station) => (
                  <Option key={station.id} value={station.id.toString()}>
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
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: '100%' }}
                size={screens.xs ? 'small' : 'middle'}
                allowClear={true}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={`${
                selectedStation === 'all' ? 'Total' : 'Station'
              } Passengers`}
              value={displayData.totalPassengers || 0}
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
                ((displayData.totalPassengers || 0) / 1000) * 100
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
              title={`${
                selectedStation === 'all' ? 'Total' : 'Station'
              } Available Taxis`}
              value={displayData.availableTaxis || 0}
              prefix={<FaTaxi style={{ color: 'green' }} />}
            />
            <Progress
              percent={Math.min(
                100,
                ((displayData.availableTaxis || 0) / 300) * 100
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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <Text strong>
                  {selectedStation === 'all' ? 'Overall' : 'Station'} Passenger
                  Trend
                </Text>
              </Space>
            }
            extra={<Tag color="blue">{formatDateRange()}</Tag>}
          >
            <div style={{ height: 300 }}>
              {filteredPassengerTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredPassengerTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
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
                    <RechartsTooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />
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
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                  }}
                >
                  <Text>No data available for the selected date range</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <Text strong>
                  {selectedStation === 'all' ? 'Top Station' : 'Station'}{' '}
                  Performance
                </Text>
              </Space>
            }
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationPerformance3}>
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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <Text strong>
                  {selectedStation === 'all' ? 'Overall' : 'Station'} Queue
                  Distribution
                </Text>
              </Space>
            }
          >
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPassengerTaxiDistribution}
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
                    {filteredPassengerTaxiDistribution.map((entry, index) => (
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
              <Text strong>Passengers: {displayData.totalPassengers || 0}</Text>
              <br />
              <Text strong>
                Available Taxis: {displayData.availableTaxis || 0}
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
                <Text>{displayData.availableTaxis || 0}</Text>
              </Space>
              <Progress
                percent={Math.min(
                  100,
                  ((displayData.availableTaxis || 0) / 300) * 100
                )}
                size="small"
                status="active"
                strokeColor={CHART_COLORS.success}
              />
            </div>

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
                  {dashboardStats.totalTaxis && displayData.availableTaxis
                    ? dashboardStats.totalTaxis - displayData.availableTaxis
                    : 0}
                </Text>
              </Space>
              <Progress
                percent={
                  dashboardStats.totalTaxis && displayData.availableTaxis
                    ? Math.round(
                        ((dashboardStats.totalTaxis -
                          displayData.availableTaxis) /
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
