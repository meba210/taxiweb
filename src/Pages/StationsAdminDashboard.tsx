import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Typography, Space, 
  Button, Select, DatePicker, Tooltip, Grid, Spin,
  Progress, Tag, Avatar, Input, Tabs, Badge, Alert,
  message
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ScheduleOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { FaTaxi, FaUsers, FaChartLine, FaRoute, FaUserCog } from 'react-icons/fa';
import { MdDirectionsCar } from 'react-icons/md';
import { GiSteeringWheel, GiPathDistance } from 'react-icons/gi';
import { TbRoute } from 'react-icons/tb';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Route, useParams } from 'react-router-dom';
import { PiHandWaving } from 'react-icons/pi';
import { IoMdPerson } from 'react-icons/io';
import { CiRoute } from 'react-icons/ci';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

// Chart colors
const CHART_COLORS = {
  primary: '#1890ff',
  secondary: '#52c41a',
  accent: '#722ed1',
  warning: '#fa8c16',
  error: '#f5222d',
  success: '#52c41a',
  info: '#13c2c2',
  purple: '#722ed1'
};

type StationStats = {
   passengersQueue?: number;
  totalTaxis?: number;
  availableTaxis?: number;
  totaldispachers?: number;
  totalroutes?: number;
};
const StationsAdminDashboard= () => {
  const [timeRange, setTimeRange] = useState('today');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();
   const token = localStorage.getItem("token");
 const { id } = useParams<{ id: string }>();
  // Current station data
  const [currentStation, setCurrentStation] = useState({
    id: 1,
    location: 'City Center',
    admins: 3,
    dispatchers: 12,
    taxis: 45,
    queue: 23,
    status: 'active',
    rating: 4.5
  });

  const[stations,setStations]= useState<string | null>(null);
   const[name,setname]= useState<string | null>(null);
   const fetchAssignedStation = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("No token found");
        return;
      }
      console.log("Token from localStorage:", token);
      console.log("Token exists:", !!token);

      const res = await axios.get(`http://localhost:5000/stationAdmins/stationadmin-stations`, {
       headers: { Authorization: `Bearer ${token}` },
      });

      setStations(res.data.station);
      setname(res.data.name);
    } catch (err: any) {
      console.error(err);
      message.error("Failed to fetch assigned route");
    }
  };

  useEffect(()=>{
     console.log("Stations state:", stations);
   fetchAssignedStation();
},[])

const fetchpassengers = async () => {
    try {
      setLoading(true);
      const stationName = stations ?? currentStation.location;
      if (!stationName) {
        console.warn('No station specified for fetching passengers');
        return;
      }

        const response = await axios.get(
      "http://localhost:5000/passengerqueue/eachstation",
      {
        params: { route: stationName }, 
         headers: { Authorization: `Bearer ${token}` },
      }
    );
      setStationStats(prev => ({
        ...prev,
        passengersQueue: response.data.total
      }));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
    if (stations || currentStation.location) {
      fetchpassengers();
    }
},[stations, currentStation.location])

const fetchtotalTaxis = async () => {
    try {
      setLoading(true);
      const stationName = stations ?? currentStation.location;
      if (!stationName) {
        console.warn('No station specified for fetching passengers');
        return;
      }

        const response = await axios.get(
      "http://localhost:5000/taxis/eachstation",
      {
        params: { route: stationName }, 
         headers: { Authorization: `Bearer ${token}` },
      }
    );
      setStationStats(prev => ({
        ...prev,
        totalTaxis: response.data.total
      }));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
    if (stations || currentStation.location) {
      fetchtotalTaxis();
    }
},[stations, currentStation.location])

const fetchavailableTaxis = async () => {
    try {
      setLoading(true);
      const stationName = stations ?? currentStation.location;
      if (!stationName) {
        console.warn('No station specified for fetching passengers');
        return;
      }

        const response = await axios.get(
      "http://localhost:5000/taxi-queue/availableTaxiseachstation",
      {
        params: { route: stationName }, 
         headers: { Authorization: `Bearer ${token}` },
      }
    );
      setStationStats(prev => ({
        ...prev,
        availableTaxis: response.data.total
      }));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
    if (stations || currentStation.location) {
      fetchavailableTaxis();
    }
},[stations, currentStation.location])


const fetchtotaldispacher = async () => {
    try {
      setLoading(true);

      if (!token) {
      console.error('No token found');
      return;
    }
        const response = await axios.get(
      "http://localhost:5000/dispachers/eachstation",
      {
      headers: { Authorization: `Bearer ${token}` },
      }
    );
      setStationStats(prev => ({
        ...prev,
        totaldispachers: response.data.total
      }));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
  if (stations || currentStation.location) {
       fetchtotaldispacher();
  }
},[stations, currentStation.location])



   const [stationStats, setStationStats] = useState<StationStats>({});
  const [passengerTrend, setPassengerTrend] = useState<{ day: string; passengers: number; queue: number }[]>([]);
  const [queueTrend, setQueueTrend] = useState<{ hour: string; queue: number }[]>([]);
  const [taxisStatus, setTaxisStatus] = useState<{ name: string; value: number; color: string }[]>([]);
  const [dispatcherPerformance, setDispatcherPerformance] = useState<{ name: string; efficiency: number; assignments: number }[]>([]);

  // Fetch station data
  const fetchStationData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Generate chart data
        generateChartData();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching station data:', error);
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchStationData();
  }, [timeRange]);

 const fetchtotalroute = async () => {
    try {
      setLoading(true);

       const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found for total routes");
      return;
    }
        const response = await axios.get(
      "http://localhost:5000/routes/eachstation",
      {
      headers: { Authorization: `Bearer ${token}` },
      }
    );
      setStationStats(prev => ({
        ...prev,
        totalroutes: response.data.total
      }));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
  if (stations) {
       fetchtotalroute();
  }
},[stations])

  const generateChartData = () => {
  
  };




  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }


 

  return (
    <div style={{ padding: screens.xs ? '16px' : '24px' }}>
      {/* Station Header */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #acbaf7ff 0%, #667eea 0% )', color: 'white' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Space direction="vertical" size="middle">
              <Space>
                <Avatar 
                  size={screens.xs ? 40 : 64}
                  icon={<EnvironmentOutlined />}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <div>
                  <Title level={screens.xs ? 4 : 2} style={{ color: 'white', margin: 0 }}>
                     {typeof stations === 'string' ? stations : JSON.stringify(stations) || "Loading..."}
                  </Title>
      
                </div>
              </Space>
              
              <Space wrap>
                <Tag color="green" style={{ borderColor: 'white', color: 'white', background: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircleOutlined /> Active
                </Tag>
                <Tag color="purple" style={{  display: 'flex', alignItems: 'center',borderColor: 'white', color: 'white', background: 'rgba(255,255,255,0.2)' }}>
                  <PiHandWaving /> Hello !  {name} 
                </Tag>
              </Space>
            </Space>
          </Col>
          
          <Col xs={24} md={8}>
            <Row gutter={[8, 8]}>
              <Col xs={12}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                  <Title level={3} style={{ color: 'white', margin: 0 }}>{stationStats.passengersQueue ||'0'}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>In Queue</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                  <Title level={3} style={{ color: 'white', margin: 0 }}>{stationStats.totalTaxis ||'0'}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Taxis</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                  <Title level={3} style={{ color: 'white', margin: 0 }}>{stationStats.totaldispachers ||'0'}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Dispatchers</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                  <Title level={3} style={{ color: 'white', margin: 0 }}>94%</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Efficiency</Text>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Dashboard Controls */}
      <Card size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="small">
              <Text strong>Time Range</Text>
              <Select 
                value={timeRange} 
                onChange={setTimeRange}
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="today">Today</Option>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="small">
              <Text strong>Refresh</Text>
              <Button icon={<ReloadOutlined />} block onClick={fetchStationData}>
                Refresh Data
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Key Performance Indicators */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Passengers InQueue"
              value={stationStats. passengersQueue}
              prefix={<FaUsers style={{ color: CHART_COLORS.primary }} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Available Taxis"
              value={stationStats.availableTaxis}
              prefix={<FaTaxi style={{ color: CHART_COLORS.success }} />}
              suffix={`/ ${stationStats.totalTaxis}`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Routes"
              value={stationStats.totalroutes}
              prefix={ <CiRoute className="text-blue-500" />}
            />
          </Card>
        </Col>

         <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Total Dispachers"
              value={stationStats.totaldispachers}
              prefix={<IoMdPerson style={{color:'red'}}/>}
              
            />
          </Card>
        </Col>
        
       
      </Row>

      {/* Main Charts Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Passenger & Queue Trend */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <Text strong>Passenger & Queue Trend</Text>
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={passengerTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="passengers" 
                    name="Passengers"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="queue" 
                    name="Queue Size"
                    stroke={CHART_COLORS.warning}
                    fill={CHART_COLORS.warning}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Taxis Status Distribution */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <FaTaxi />
                <Text strong>Taxis Status Distribution</Text>
              </Space>
            }
            extra={<Button type="link" size="small">View Details</Button>}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ height: 250, textAlign: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taxisStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {taxisStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value} taxis`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%', padding: '16px' }}>
                  {taxisStatus.map((status, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                          <div style={{ width: '12px', height: '12px', backgroundColor: status.color, borderRadius: '50%' }} />
                          <Text>{status.name}</Text>
                        </Space>
                        <Text strong>{status.value} taxis</Text>
                      </Space>
                      <Progress 
                        percent={Math.round((status.value / currentStation.taxis) * 100)} 
                        size="small"
                        strokeColor={status.color}
                        showInfo={false}
                      />
                    </div>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Queue Management & Dispatcher Performance */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Queue Throughout Day */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <ScheduleOutlined />
                <Text strong>Queue Throughout the Day</Text>
              </Space>
            }
          >
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar 
                    dataKey="queue" 
                    name="Passengers in Queue"
                    fill={CHART_COLORS.warning}
                    radius={[4, 4, 0, 0]}
                  >
                    {queueTrend.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.queue > 20 ? CHART_COLORS.error : entry.queue > 15 ? CHART_COLORS.warning : CHART_COLORS.success} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Dispatcher Performance */}
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <GiSteeringWheel />
                <Text strong>Dispatcher Performance</Text>
              </Space>
            }
            extra={<Badge count="5" color="green" />}
          >
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dispatcherPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar 
                    dataKey="efficiency" 
                    name="Efficiency %"
                    fill={CHART_COLORS.success}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="assignments" 
                    name="Assignments"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

     

      {/* Quick Actions & Alerts */}
      <Row gutter={[16, 16]}>
       
        
        {/* <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <SettingOutlined />
                <Text strong>Quick Actions</Text>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              
              <Button block icon={<FaTaxi />} size="large">
                Assign Available Taxis
              </Button>
              
              <Button block icon={<BarChartOutlined />} size="large">
                Generate Daily Report
              </Button>
              
              <Button block icon={<FaUserCog />} size="large">
                Manage Dispatchers
              </Button>
              
              <Button block icon={<TbRoute />} size="large">
                Update Routes
              </Button>
            </Space>
          </Card>
        </Col> */}
      </Row>

      {/* Performance Summary
      <Card style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress 
                type="circle" 
                percent={stationStats.completionRate} 
                strokeColor={stationStats.completionRate > 90 ? CHART_COLORS.success : CHART_COLORS.warning}
                size={120}
                format={percent => (
                  <div>
                    <Text strong style={{ fontSize: '24px' }}>{percent}%</Text>
                    <br />
                    <Text type="secondary">Completion Rate</Text>
                  </div>
                )}
              />
            </div>
          </Col>
          
          {/* <Col xs={24} md={16}>
            <Title level={4}>Station Performance Summary</Title>
            <Text>
              Your station is performing well with {stationStats.completionRate}% trip completion rate. 
              The average wait time is {stationStats.avgWaitTime} minutes, which is below the 10-minute target. 
              Keep up the good work in managing {currentStation.dispatchers} dispatchers and {currentStation.taxis} taxis efficiently.
            </Text>
            
            <div style={{ marginTop: '16px' }}>
              <Space wrap>
                <Tag color="green">
                  <CheckCircleOutlined /> Station Active
                </Tag>
                <Tag color="blue">
                  <TeamOutlined /> {stationStats.activeDispatchers}/{currentStation.dispatchers} Active Dispatchers
                </Tag>
                <Tag color="purple">
                  <FaTaxi /> {stationStats.availableTaxis}/{currentStation.taxis} Taxis Available
                </Tag>
              </Space>
            </div>
          </Col> */}
        {/* </Row>
      </Card> */} 
    </div>
  );
};

export default StationsAdminDashboard;