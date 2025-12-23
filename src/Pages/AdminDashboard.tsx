import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Typography, Space, 
  Button, Select, DatePicker, Tooltip, Grid, Spin,
  Progress, Tag, Avatar
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { FaTaxi, FaUsers, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
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
  ResponsiveContainer
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
  totalstations?:number;
  totalstationadmins?: number;
  totaldispachers?: number;
  totalroutes?: number;
  passengerChange?: number;
  taxiChange?: number;
  revenueChange?: number;
  activeTripsChange?: number;
   availableTaxisEachStation?: number;
};

type Station = {
  id: number;
  StationName: string;
  location: string;
  admins: number;
  dispatchers: number;
  taxis: number;
  queue: number;
  status: 'active'  | 'inactive';
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

  const [passengerTaxiDistribution, setPassengerTaxiDistribution] = useState<ChartData[]>([]);
  const [taxisByStatus, setTaxisByStatus] = useState<ChartData[]>([]);

  // Colors for charts
  const CHART_COLORS = {
    primary: '#1890ff',
    secondary: '#52c41a',
    accent: '#722ed1',
    warning: '#fa8c16',
    error: '#f5222d',
    success: '#52c41a',
    info: '#1890ff'
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stations");
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
      const response = await axios.get("http://localhost:5000/passengerqueue");
      setDashboardStats(prev => ({
  ...prev,
  totalPassengers: response.data.total 
}));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

useEffect(()=>{
    fetchpassengers();
},[])


 const fetchtaxis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/taxis/total");
      setDashboardStats(prev => ({
  ...prev,
  totalTaxis: response.data.count  
}));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
    fetchtaxis();
},[])

const fetchavailabletaxis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/taxi-queue/total");
      setDashboardStats(prev => ({
  ...prev,
  availableTaxis: response.data.total
}));

     // generateChartData(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
   fetchavailabletaxis();
},[])


 const fetchTotalStations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stations/total");
      setDashboardStats(prev => ({
  ...prev,
  totalstations: response.data.total  
}));
      
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
   fetchTotalStations();
},[])


 const fetchTotalStationAdmin = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stationAdmins/total");
      setDashboardStats(prev => ({
  ...prev,
  totalstationadmins: response.data.total  
}));
      
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
   fetchTotalStationAdmin();
},[])

const fetchTotalDispachers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dispachers/total");
      setDashboardStats(prev => ({
  ...prev,
  totaldispachers: response.data.total  
}));
      
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
  fetchTotalDispachers();
},[])

const fetchTotalRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/routes/total");
      setDashboardStats(prev => ({
  ...prev,
  totalroutes: response.data.total  
}));
      
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
      setLoadingStats(false);
    }
  };

  useEffect(()=>{
   fetchTotalRoutes();
},[])


const fetchavailableTaxis = async () => {
    try {
      setLoading(true);
      const stationName = stations;
      if (!stationName) {
        console.warn('No station specified for fetching passengers');
        return;
      }

        const response = await axios.get(
      "http://localhost:5000/taxi-queue/availableTaxiseachstation",
      {
        params: { route: stationName },
      }
    );
      setDashboardStats(prev => ({
        ...prev,
        availableTaxisEachStation: response.data.total
      }));

    
    } catch (error) {
      console.error('Error fetching taxis:', error);
    } finally {
      setLoading(false);
      
    }
  };

useEffect(()=>{
    if (stations) {
      fetchavailableTaxis();
    }
},[stations])
const generateChartData = (stationsData: Station[]) => {
  if (!stationsData || stationsData.length === 0) {
    setStationPerformance([]);
    return;
  }

  const performanceData = stationsData
   
    .slice(0, 5)
    .map(station => ({
      name: station.StationName,  // safe now
      passengers: station.queue ?? 0,
      taxis: station.taxis ?? 0,
      efficiency:
        station.queue > 0
          ? Math.round((station.taxis / station.queue) * 100)
          : 0
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
        name: "Passengers in Queue",
        value: dashboardStats.totalPassengers,
        color: CHART_COLORS.primary
      },
      {
        name: "Available Taxis",
        value: dashboardStats.availableTaxis,
        color: CHART_COLORS.success
      }
    ]);
  }
}, [dashboardStats.totalPassengers, dashboardStats.availableTaxis]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

const safePieData =
  passengerTaxiDistribution.every(d => d.value === 0)
    ? [{ name: "No Data", value: 1, color: "#d9d9d9" }]
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
                size={screens.xs ? "small" : "middle"}
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
                size={screens.xs ? "small" : "middle"}
              >
                <Option value="all">All Stations</Option>
                {stations.map(station => (
                  <Option key={station.id} value={station.id}>{station.StationName}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space direction="vertical" size="small">
              <Text strong>Date Range</Text>
              <RangePicker 
                style={{ width: '100%' }}
                size={screens.xs ? "small" : "middle"}
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
                <Tag color={dashboardStats.passengerChange && dashboardStats.passengerChange > 0 ? 'success' : 'error'} 
                     icon={dashboardStats.passengerChange && dashboardStats.passengerChange > 0 ? <RiseOutlined /> : <FallOutlined />}>
                  {dashboardStats.passengerChange || 0}%
                </Tag>
              }
            />
            <Progress 
              percent={Math.min(100, ((dashboardStats.totalPassengers || 0) / 1000) * 100)} 
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
              value={dashboardStats.totalTaxis|| 0}
              prefix={<FaTaxi style={{ color: CHART_COLORS.success }} />}
              loading={loadingStats}
            />
            <Progress 
              percent={Math.min(100, ((dashboardStats.totalTaxis || 0) / 300) * 100)} 
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
              prefix={<GrUserAdmin style={{ color: "red" }} />}
              
            />
             <Progress 
              percent={Math.min(100, ((dashboardStats.totalstationadmins || 0) / 300) * 100)} 
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
              prefix={<EnvironmentOutlined style={{ color: CHART_COLORS.info }} />}
              
            />
             <Progress 
              percent={Math.min(100, ((dashboardStats.totalstations || 0) / 300) * 100)} 
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={passengerTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="passengers" 
                    stroke={CHART_COLORS.primary} 
                    name="Passengers"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trips" 
                    stroke={CHART_COLORS.success} 
                    name="Trips"
                    strokeWidth={2}
                    dot={{ r: 4 }}
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
            extra={<Button type="link" size="small">View All</Button>}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationPerformance}>
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
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
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

    <div style={{ marginTop: 16, textAlign: "center" }}>
      <Text strong>Total Passengers: {dashboardStats.totalPassengers || 0}</Text><br />
      <Text strong>Available Taxis: {dashboardStats.availableTaxis || 0}</Text>
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
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '4px' }}>
            <Text strong>Taxis Available</Text>
            <Text >
                {dashboardStats.availableTaxis || 0} 
              {/* {taxisByStatus.find(t => t.name === 'Available')?.value || 0} / {dashboardStats.totalTaxis || 0} */}
            </Text>
          </Space>
          <Progress 
              percent={Math.min(100, ((dashboardStats.availableTaxis || 0) / 300) * 100)} 
              size="small" 
              status="active" 
              strokeColor={CHART_COLORS.success}
            />
        </div>

        {/* Taxis in Queue (On Trip) */}
        <div style={{ marginBottom: '20px' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '4px' }}>
             <Text strong>Taxis Unavailable</Text>
        <Text strong>
          {dashboardStats.totalTaxis && dashboardStats.availableTaxis ? 
            dashboardStats.totalTaxis - dashboardStats.availableTaxis : 0}
        </Text>
      </Space>
      <Progress 
        percent={dashboardStats.totalTaxis && dashboardStats.availableTaxis ? 
          Math.round(((dashboardStats.totalTaxis - dashboardStats.availableTaxis) / dashboardStats.totalTaxis) * 100) : 0} 
        size="small"
        strokeColor={CHART_COLORS.warning}
      />
    </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Text type="secondary">Total: {dashboardStats.totalTaxis || 0} taxis</Text>
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
                const count = stations.filter(s => s.status === status).length;
                const percentage = stations.length > 0 ? (count / stations.length) * 100 : 0;
                const color = status === 'active' ? CHART_COLORS.success : 
                              status === 'busy' ? CHART_COLORS.warning : CHART_COLORS.error;
                
                return (
                  <div key={status} style={{ marginBottom: '16px' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text strong style={{ textTransform: 'capitalize' }}>{status}</Text>
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
              <div style={{ padding: '12px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
                <Text strong style={{ color: CHART_COLORS.success }}>Total Routes</Text>
                <Title level={3} style={{ margin: '8px 0' }}> {dashboardStats.totalroutes || 0}</Title>
               
              </div>
              <div style={{ padding: '12px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
                <Text strong style={{ color: CHART_COLORS.primary }}>Total Dispachers</Text>
                <Title level={3} style={{ margin: '8px 0' }}> {dashboardStats.totaldispachers || 0}</Title>
                
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;


// import React, { useState, useEffect } from 'react';
// import { 
//   Card, Row, Col, Statistic, Typography, Avatar, Space, 
//   Table, Tag, Progress, Button, Breadcrumb, Select, DatePicker,
//   Alert, Tooltip, Grid, Spin, Empty, Modal, List, Input, Popover,
//   Divider
// } from 'antd';
// import {
//   DashboardOutlined,
//   UserOutlined,
//   TeamOutlined,
//   CarOutlined,
//   EnvironmentOutlined,
//   SafetyCertificateOutlined,
//   ClockCircleOutlined,
//   RiseOutlined,
//   FallOutlined,
//   BarChartOutlined,
//   SettingOutlined,
//   SearchOutlined,
//   ExpandOutlined,
//   AimOutlined,
//   InfoCircleOutlined
// } from '@ant-design/icons';
// import { FaTaxi, FaUsers, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
// import { MdAdminPanelSettings } from 'react-icons/md';
// import axios from 'axios';

// // Import OpenStreetMap components
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';


//   const iconRetinaUrl=('leaflet/dist/images/marker-icon-2x.png')
//   const iconUrl=('leaflet/dist/images/marker-icon.png')
//  const shadowUrl=('leaflet/dist/images/marker-shadow.png')


// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl,
//   iconUrl,
//   shadowUrl,
// });

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { useBreakpoint } = Grid;

// // Define types
// type DashboardStats = {
//   totalPassengers?: number;
//   totalTaxis?: number;
//   activeTrips?: number;
//   totalRevenue?: number;
//   passengerChange?: number;
//   taxiChange?: number;
//   revenueChange?: number;
//   activeTripsChange?: number;
// };

// type Station = {
//   id: number;
//   name: string;
//   location: string;
//   latitude: number;
//   longitude: number;
//   admins: number;
//   dispatchers: number;
//   taxis: number;
//   queue: number;
//   status: 'active' | 'busy' | 'inactive';
//   address?: string;
//   contact?: string;
// };

// type SystemHealth = {
//   apiStatus?: number;
//   databaseStatus?: number;
//   serverUptime?: number;
//   mobileAppStatus?: number;
// };

// type Activity = {
//   time: string;
//   action: string;
//   station: string;
//   type: string;
// };

// // Custom Map Component
// const StationMap = ({ stations, selectedStationId, onStationSelect }: { 
//   stations: Station[], 
//   selectedStationId?: number,
//   onStationSelect?: (stationId: number) => void 
// }) => {
//   const map = useMap();
  
//   // Addis Ababa center coordinates
//   const addisAbabaCenter: [number, number] = [9.0320, 38.7469];

//   // Custom icons for different station statuses
//   const customIcons = {
//     active: new L.Icon({
//       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//       popupAnchor: [1, -34],
//       shadowSize: [41, 41]
//     }),
//     busy: new L.Icon({
//       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//       popupAnchor: [1, -34],
//       shadowSize: [41, 41]
//     }),
//     inactive: new L.Icon({
//       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
//       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//       popupAnchor: [1, -34],
//       shadowSize: [41, 41]
//     })
//   };

//   // Fit bounds to show all stations
//   useEffect(() => {
//     if (stations.length > 0 && map) {
//       const bounds = L.latLngBounds(stations.map(s => [s.latitude, s.longitude]));
//       map.fitBounds(bounds, { padding: [50, 50] });
//     }
//   }, [stations, map]);

//   // Zoom to selected station
//   useEffect(() => {
//     if (selectedStationId && map) {
//       const station = stations.find(s => s.id === selectedStationId);
//       if (station) {
//         map.setView([station.latitude, station.longitude], 15);
//       }
//     }
//   }, [selectedStationId, stations, map]);

//   const getStationIcon = (status: Station['status']) => {
//     return customIcons[status] || customIcons.active;
//   };

//   const handleMarkerClick = (stationId: number) => {
//     if (onStationSelect) {
//       onStationSelect(stationId);
//     }
//   };

//   return (
//     <>
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
      
//       {stations.map((station) => (
//         <Marker
//           key={station.id}
//           position={[station.latitude, station.longitude]}
//           icon={getStationIcon(station.status)}
//           eventHandlers={{
//             click: () => handleMarkerClick(station.id),
//           }}
//         >
//           <Popup>
//             <div style={{ minWidth: '200px' }}>
//               <Space direction="vertical" size={4}>
//                 <Title level={5} style={{ margin: 0 }}>{station.name}</Title>
//                 <Text type="secondary" style={{ fontSize: '12px' }}>
//                   {station.location}
//                 </Text>
//                 <Divider style={{ margin: '8px 0' }} />
                
//                 <Space direction="vertical" size={2}>
//                   <Space>
//                     <TeamOutlined style={{ color: '#1890ff' }} />
//                     <Text>Queue: {station.queue} passengers</Text>
//                   </Space>
//                   <Space>
//                     <CarOutlined style={{ color: '#52c41a' }} />
//                     <Text>Taxis: {station.taxis} available</Text>
//                   </Space>
//                   <Space>
//                     <UserOutlined style={{ color: '#722ed1' }} />
//                     <Text>Dispatchers: {station.dispatchers}</Text>
//                   </Space>
//                 </Space>
                
//                 <Divider style={{ margin: '8px 0' }} />
                
//                 <Space>
//                   <Tag color={station.status === 'active' ? 'success' : 
//                              station.status === 'busy' ? 'error' : 'warning'}>
//                     {station.status.toUpperCase()}
//                   </Tag>
//                   <Button 
//                     type="link" 
//                     size="small" 
//                     icon={<AimOutlined />}
//                     onClick={() => onStationSelect && onStationSelect(station.id)}
//                   >
//                     Focus
//                   </Button>
//                 </Space>
//               </Space>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </>
//   );
// };

// // Main Dashboard Component
// const AdminDashboard = () => {
//   const [timeRange, setTimeRange] = useState('today');
//   const [selectedStation, setSelectedStation] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [loadingStats, setLoadingStats] = useState(true);
//   const [loadingStations, setLoadingStations] = useState(true);
//   const [mapModalOpen, setMapModalOpen] = useState(false);
//   const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
//   const [searchText, setSearchText] = useState('');
//   const screens = useBreakpoint();

//   // State for fetched data
//   const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
//   const [stations, setStations] = useState<Station[]>([
//     // Default stations with Addis Ababa coordinates
//     {
//       id: 1,
//       name: 'Bole Main Station',
//       location: 'Bole Area',
//       latitude: 8.9906,
//       longitude: 38.7892,
//       admins: 3,
//       dispatchers: 12,
//       taxis: 45,
//       queue: 23,
//       status: 'active',
//       address: 'Bole Road, near Bole Airport',
//       contact: '+251 11 123 4567'
//     },
//     {
//       id: 2,
//       name: 'Megenagna Station',
//       location: 'Megenagna Square',
//       latitude: 9.0224,
//       longitude: 38.7718,
//       admins: 2,
//       dispatchers: 8,
//       taxis: 32,
//       queue: 15,
//       status: 'active',
//       address: 'Megenagna Square, Next to Friendship Center',
//       contact: '+251 11 234 5678'
//     },
//     {
//       id: 3,
//       name: 'Merkato Station',
//       location: 'Merkato Area',
//       latitude: 9.0360,
//       longitude: 38.7469,
//       admins: 2,
//       dispatchers: 10,
//       taxis: 38,
//       queue: 8,
//       status: 'active',
//       address: 'Merkato Main Entrance',
//       contact: '+251 11 345 6789'
//     },
//     {
//       id: 4,
//       name: 'Airport Station',
//       location: 'Bole International Airport',
//       latitude: 8.9771,
//       longitude: 38.7993,
//       admins: 1,
//       dispatchers: 6,
//       taxis: 28,
//       queue: 42,
//       status: 'busy',
//       address: 'Bole International Airport, Terminal 2',
//       contact: '+251 11 456 7890'
//     },
//     {
//       id: 5,
//       name: 'Piassa Station',
//       location: 'Piassa Area',
//       latitude: 9.0333,
//       longitude: 38.7500,
//       admins: 1,
//       dispatchers: 5,
//       taxis: 22,
//       queue: 5,
//       status: 'active',
//       address: 'Piassa, Near City Hall',
//       contact: '+251 11 567 8901'
//     },
//     {
//       id: 6,
//       name: 'Mekanisa Station',
//       location: 'Mekanisa Area',
//       latitude: 9.0150,
//       longitude: 38.7300,
//       admins: 1,
//       dispatchers: 4,
//       taxis: 18,
//       queue: 12,
//       status: 'inactive',
//       address: 'Mekanisa, Near St. Gabriel Church',
//       contact: '+251 11 678 9012'
//     }
//   ]);
//   const [systemHealth, setSystemHealth] = useState<SystemHealth>({});
//   const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

//   // Fetch dashboard statistics
// //   const fetchDashboardStats = async () => {
// //     try {
// //       setLoadingStats(true);
// //       const response = await axios.get('/api/dashboard/stats', {
// //         params: { timeRange, selectedStation }
// //       });
// //       setDashboardStats(response.data);
// //     } catch (error) {
// //       console.error('Error fetching dashboard stats:', error);
// //       // Use mock data for demo
// //       setDashboardStats({
// //         totalPassengers: 1520,
// //         totalTaxis: 245,
// //         activeTrips: 87,
// //         totalRevenue: 254800,
// //         passengerChange: 12.5,
// //         taxiChange: 3.2,
// //         revenueChange: 8.7,
// //         activeTripsChange: -2.1
// //       });
// //     } finally {
// //       setLoadingStats(false);
// //     }
// //   };

//   // Fetch stations data
//   const fetchStations = async () => {
//     try {
//       setLoadingStations(true);
//      const response = await axios.get("http://localhost:5000/stations");
//       setStations(response.data);
//     } catch (error) {
//       console.error('Error fetching stations:', error);
//       // Stations already have default data
//     } finally {
//       setLoadingStations(false);
//     }
//   };

 

//   // Fetch recent activities
 

//   // Initial data fetch
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await Promise.all([
//        // fetchDashboardStats(),
//         fetchStations(),
       
//       ]);
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   // Refetch dashboard stats when filters change
// //   useEffect(() => {
// //     if (!loading) {
// //       fetchDashboardStats();
// //     }
// //   }, [timeRange, selectedStation]);

//   // Filter stations based on search
//   const filteredStations = stations.filter(station =>
//     station.name.toLowerCase().includes(searchText.toLowerCase()) ||
//     station.location.toLowerCase().includes(searchText.toLowerCase())
//   );

//   // Station columns for table
//   const stationColumns = [
//     {
//       title: 'Station Name',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text: string, record: Station) => (
//         <Space>
//           <Avatar icon={<EnvironmentOutlined />} style={{ 
//             backgroundColor: record.status === 'active' ? '#52c41a' : 
//                            record.status === 'busy' ? '#faad14' : '#ff4d4f' 
//           }} />
//           <div>
//             <Text strong>{text}</Text>
//             <div>
//               <Text type="secondary" style={{ fontSize: '12px' }}>{record.location}</Text>
//             </div>
//           </div>
//         </Space>
//       )
//     },
//     {
//       title: 'Location',
//       key: 'coordinates',
//       render: (record: Station) => (
//         <Space direction="vertical" size={0}>
//           <Text style={{ fontSize: '12px' }}>
//             <AimOutlined /> {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
//           </Text>
//           <Button 
//             type="link" 
//             size="small" 
//             onClick={() => {
//               setSelectedStationId(record.id);
//               setMapModalOpen(true);
//             }}
//           >
//             View on Map
//           </Button>
//         </Space>
//       )
//     },
//     {
//       title: 'Personnel',
//       key: 'personnel',
//       render: (record: Station) => (
//         <Space direction="vertical" size={0}>
//           <Text><UserOutlined style={{ marginRight: 4 }} /> {record.admins} Admins</Text>
//           <Text><TeamOutlined style={{ marginRight: 4 }} /> {record.dispatchers} Dispatchers</Text>
//         </Space>
//       )
//     },
//     {
//       title: 'Resources',
//       key: 'resources',
//       render: (record: Station) => (
//         <Space direction="vertical" size={0}>
//           <Text><CarOutlined style={{ marginRight: 4 }} /> {record.taxis} Taxis</Text>
//           <Text><TeamOutlined style={{ marginRight: 4 }} /> {record.queue} in Queue</Text>
//         </Space>
//       )
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: string) => {
//         let color = 'default';
//         let text = status;
        
//         if (status === 'active') {
//           color = 'success';
//           text = 'Active';
//         } else if (status === 'busy') {
//           color = 'warning';
//           text = 'Busy';
//         } else if (status === 'inactive') {
//           color = 'error';
//           text = 'Inactive';
//         }
        
//         return <Tag color={color}>{text}</Tag>;
//       }
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (record: Station) => (
//         <Button 
//           type="link" 
//           size="small"
//           onClick={() => {
//             setSelectedStationId(record.id);
//             setMapModalOpen(true);
//           }}
//         >
//           <AimOutlined /> View Map
//         </Button>
//       )
//     }
//   ];

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: screens.xs ? '16px' : '24px' }}>
//       <Breadcrumb style={{ marginBottom: '24px' }}>
//         <Breadcrumb.Item>
//           <DashboardOutlined />
//           <span>Dashboard</span>
//         </Breadcrumb.Item>
//         <Breadcrumb.Item>Admin Dashboard</Breadcrumb.Item>
//       </Breadcrumb>

//       {/* Dashboard Filters */}
//       <Card size="small" style={{ marginBottom: 24 }}>
//         <Row gutter={[16, 16]} align="middle">
//           <Col xs={24} sm={12} md={8}>
//             <Space direction="vertical" size="small">
//               <Text strong>Time Range</Text>
//               <Select 
//                 value={timeRange} 
//                 onChange={setTimeRange}
//                 style={{ width: '100%' }}
//                 size={screens.xs ? "small" : "middle"}
//                 loading={loadingStats}
//               >
//                 <Option value="today">Today</Option>
//                 <Option value="week">This Week</Option>
//                 <Option value="month">This Month</Option>
//                 <Option value="quarter">This Quarter</Option>
//                 <Option value="year">This Year</Option>
//               </Select>
//             </Space>
//           </Col>
//           <Col xs={24} sm={12} md={8}>
//             <Space direction="vertical" size="small">
//               <Text strong>Station Filter</Text>
//               <Select 
//                 value={selectedStation} 
//                 onChange={setSelectedStation}
//                 style={{ width: '100%' }}
//                 size={screens.xs ? "small" : "middle"}
//                 loading={loadingStations}
//               >
//                 <Option value="all">All Stations</Option>
//                 {stations.map(station => (
//                   <Option key={station.id} value={station.id}>{station.name}</Option>
//                 ))}
//               </Select>
//             </Space>
//           </Col>
//           <Col xs={24} md={8}>
//             <Space direction="vertical" size="small">
//               <Text strong>Date Range</Text>
//               <RangePicker 
//                 style={{ width: '100%' }}
//                 size={screens.xs ? "small" : "middle"}
//               />
//             </Space>
//           </Col>
//         </Row>
//       </Card>

//       {/* Key Statistics Cards */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Total Passengers"
//               value={dashboardStats.totalPassengers || 0}
//               prefix={<FaUsers style={{ color: '#1890ff' }} />}
//               loading={loadingStats}
//               suffix={
//                 dashboardStats.passengerChange !== undefined ? (
//                   <Tag color={dashboardStats.passengerChange > 0 ? 'success' : 'error'} 
//                        icon={dashboardStats.passengerChange > 0 ? <RiseOutlined /> : <FallOutlined />}>
//                     {dashboardStats.passengerChange}%
//                   </Tag>
//                 ) : null
//               }
//             />
//             <Progress 
//               percent={75} 
//               size="small" 
//               status="active" 
//               strokeColor={{
//                 '0%': '#108ee9',
//                 '100%': '#87d068',
//               }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Registered Taxis"
//               value={dashboardStats.totalTaxis || 0}
//               prefix={<FaTaxi style={{ color: '#52c41a' }} />}
//               loading={loadingStats}
//               suffix={
//                 dashboardStats.taxiChange !== undefined ? (
//                   <Tag color={dashboardStats.taxiChange > 0 ? 'success' : 'error'} 
//                        icon={dashboardStats.taxiChange > 0 ? <RiseOutlined /> : <FallOutlined />}>
//                     {dashboardStats.taxiChange}%
//                   </Tag>
//                 ) : null
//               }
//             />
//             <Progress percent={82} size="small" status="active" />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Active Trips"
//               value={dashboardStats.activeTrips || 0}
//               prefix={<FaMapMarkedAlt style={{ color: '#722ed1' }} />}
//               loading={loadingStats}
//               suffix={
//                 dashboardStats.activeTripsChange !== undefined ? (
//                   <Tag color={dashboardStats.activeTripsChange > 0 ? 'success' : 'error'} 
//                        icon={dashboardStats.activeTripsChange > 0 ? <RiseOutlined /> : <FallOutlined />}>
//                     {dashboardStats.activeTripsChange}%
//                   </Tag>
//                 ) : null
//               }
//             />
//             <Progress percent={65} size="small" status="active" />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} lg={6}>
//           <Card>
//             <Statistic
//               title="Total Revenue"
//               value={dashboardStats.totalRevenue || 0}
//               prefix="ETB"
//               loading={loadingStats}
//               suffix={
//                 dashboardStats.revenueChange !== undefined ? (
//                   <Tag color={dashboardStats.revenueChange > 0 ? 'success' : 'error'} 
//                        icon={dashboardStats.revenueChange > 0 ? <RiseOutlined /> : <FallOutlined />}>
//                     {dashboardStats.revenueChange}%
//                   </Tag>
//                 ) : null
//               }
//             />
//             <Progress percent={88} size="small" status="active" />
//           </Card>
//         </Col>
//       </Row>

//       {/* Map Section */}
//       <Card 
//         title={
//           <Space>
//             <EnvironmentOutlined />
//             <Text strong>Stations Map - Addis Ababa</Text>
//           </Space>
//         }
//         extra={
//           <Space>
//             <Input
//               placeholder="Search stations..."
//               prefix={<SearchOutlined />}
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               style={{ width: 200 }}
//               size="small"
//             />
//             <Button 
//               icon={<ExpandOutlined />}
//               onClick={() => setMapModalOpen(true)}
//             >
//               Full Screen
//             </Button>
//           </Space>
//         }
//         style={{ marginBottom: 24 }}
//       >
//         <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
//           <MapContainer
//             center={[9.0320, 38.7469]}
//             zoom={12}
//             style={{ height: '100%', width: '100%' }}
//             scrollWheelZoom={true}
//           >
//             <StationMap 
//               stations={filteredStations}
//               selectedStationId={selectedStationId || undefined}
//               onStationSelect={setSelectedStationId}
//             />
//           </MapContainer>
//         </div>

//         {/* Map Legend and Info */}
//         <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
//           <Col xs={24} md={12}>
//             <Card size="small">
//               <Space direction="vertical" size={8}>
//                 <Text strong>Map Legend</Text>
//                 <Space>
//                   <div style={{ width: '16px', height: '16px', backgroundColor: '#2E8B57', borderRadius: '4px' }} />
//                   <Text>Active Station (Green)</Text>
//                 </Space>
//                 <Space>
//                   <div style={{ width: '16px', height: '16px', backgroundColor: '#DC143C', borderRadius: '4px' }} />
//                   <Text>Busy Station (Red)</Text>
//                 </Space>
//                 <Space>
//                   <div style={{ width: '16px', height: '16px', backgroundColor: '#FF8C00', borderRadius: '4px' }} />
//                   <Text>Inactive Station (Orange)</Text>
//                 </Space>
//               </Space>
//             </Card>
//           </Col>
//           <Col xs={24} md={12}>
//             <Card size="small">
//               <Space direction="vertical" size={8}>
//                 <Text strong>Quick Map Actions</Text>
//                 <Button 
//                   size="small" 
//                   block 
//                   onClick={() => setSelectedStationId(null)}
//                 >
//                   Reset View
//                 </Button>
//                 <Button 
//                   size="small" 
//                   block 
//                   type="primary"
//                   onClick={() => {
//                     if (filteredStations.length > 0) {
//                       setSelectedStationId(filteredStations[0].id);
//                     }
//                   }}
//                 >
//                   Focus First Station
//                 </Button>
//               </Space>
//             </Card>
//           </Col>
//         </Row>
//       </Card>

//       {/* System Health & Recent Activities */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} lg={12}>
//           <Card 
//             title={
//               <Space>
//                 <SafetyCertificateOutlined />
//                 <Text strong>System Health Status</Text>
//               </Space>
//             }
//             extra={<Button type="link">View Details</Button>}
//           >
//             {Object.keys(systemHealth).length > 0 ? (
//               <Space direction="vertical" style={{ width: '100%' }}>
//                 {Object.entries(systemHealth).map(([key, value]) => (
//                   <div key={key} style={{ marginBottom: 12 }}>
//                     <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 4 }}>
//                       <Text>{key.replace('Status', '').replace('Uptime', ' Uptime').replace('api', 'API')}</Text>
//                       <Text strong>{value}%</Text>
//                     </Space>
//                     <Progress 
//                       percent={value} 
//                       strokeColor={value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f'}
//                       size="small"
//                     />
//                   </div>
//                 ))}
//               </Space>
//             ) : (
//               <Empty description="No system health data available" />
//             )}
//           </Card>
//         </Col>
//         <Col xs={24} lg={12}>
//           <Card 
//             title={
//               <Space>
//                 <ClockCircleOutlined />
//                 <Text strong>Recent Activities</Text>
//               </Space>
//             }
//             extra={<Button type="link">View All</Button>}
//           >
//             {recentActivities.length > 0 ? (
//               <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                 {recentActivities.map((activity, index) => (
//                   <div key={index} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: index < recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
//                     <Space direction="vertical" size={2}>
//                       <Text strong>{activity.action}</Text>
//                       <Space>
//                         <Text type="secondary" style={{ fontSize: '12px' }}>{activity.time}</Text>
//                         <Tag color="default" >{activity.station}</Tag>
//                       </Space>
//                     </Space>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Empty description="No recent activities" />
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* Stations Overview Table */}
//       <Card 
//         title={
//           <Space>
//             <EnvironmentOutlined />
//             <Text strong>Stations Overview</Text>
//             <Tag color="blue">{stations.length} Total Stations</Tag>
//           </Space>
//         }
//         extra={
//           <Space>
//             <Popover
//               content={
//                 <div style={{ padding: '8px' }}>
//                   <Text>Total Stations: {stations.length}</Text><br />
//                   <Text>Active: {stations.filter(s => s.status === 'active').length}</Text><br />
//                   <Text>Busy: {stations.filter(s => s.status === 'busy').length}</Text><br />
//                   <Text>Inactive: {stations.filter(s => s.status === 'inactive').length}</Text>
//                 </div>
//               }
//               title="Station Statistics"
//             >
//               <Button icon={<InfoCircleOutlined />} size="small" />
//             </Popover>
//             <Button type="primary">Manage Stations</Button>
//           </Space>
//         }
//         style={{ marginBottom: 24 }}
//       >
//         {stations.length > 0 ? (
//           <Table
//             columns={stationColumns}
//             dataSource={filteredStations}
//             pagination={{ pageSize: 5 }}
//             loading={loadingStations}
//             size={screens.xs ? "small" : "middle"}
//             scroll={screens.xs ? { x: 800 } : {}}
//             rowKey="id"
//           />
//         ) : (
//           <Empty description="No stations available" />
//         )}
//       </Card>

//       {/* Quick Actions */}
//       <Card 
//         title={
//           <Space>
//             <SettingOutlined />
//             <Text strong>Quick Actions</Text>
//           </Space>
//         }
//       >
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <Button 
//               type="primary" 
//               block 
//               icon={<MdAdminPanelSettings />}
//               size={screens.xs ? "small" : "middle"}
//             >
//               Add Admin
//             </Button>
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <Button 
//               block 
//               icon={<EnvironmentOutlined />}
//               size={screens.xs ? "small" : "middle"}
//             >
//               New Station
//             </Button>
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <Button 
//               block 
//               icon={<BarChartOutlined />}
//               size={screens.xs ? "small" : "middle"}
//             >
//               Generate Report
//             </Button>
//           </Col>
//           <Col xs={24} sm={12} md={8} lg={6}>
//             <Button 
//               block 
//               icon={<SettingOutlined />}
//               size={screens.xs ? "small" : "middle"}
//             >
//               System Settings
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Full Screen Map Modal */}
//       <Modal
//         title={
//           <Space>
//             <EnvironmentOutlined />
//             <Text strong>Addis Ababa Stations Map - Full Screen</Text>
//           </Space>
//         }
//         open={mapModalOpen}
//         onCancel={() => setMapModalOpen(false)}
//         footer={null}
//         width="90vw"
//         style={{ top: 20 }}
//         bodyStyle={{ padding: 0 }}
//       >
//         <div style={{ height: '80vh', width: '100%' }}>
//           <MapContainer
//             center={[9.0320, 38.7469]}
//             zoom={12}
//             style={{ height: '100%', width: '100%' }}
//             scrollWheelZoom={true}
//           >
//             <StationMap 
//               stations={filteredStations}
//               selectedStationId={selectedStationId || undefined}
//               onStationSelect={setSelectedStationId}
//             />
//           </MapContainer>
//         </div>
        
//         <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
//           <Row gutter={[16, 16]}>
//             <Col span={24}>
//               <Text strong>Selected Station:</Text>
//               {selectedStationId ? (
//                 <Space style={{ marginLeft: '16px' }}>
//                   <Text>{stations.find(s => s.id === selectedStationId)?.name}</Text>
//                   <Tag>{stations.find(s => s.id === selectedStationId)?.location}</Tag>
//                   <Button 
//                     type="link" 
//                     size="small"
//                     onClick={() => {
//                       // Navigate to station details
//                       console.log('Navigate to station:', selectedStationId);
//                     }}
//                   >
//                     View Details
//                   </Button>
//                 </Space>
//               ) : (
//                 <Text type="secondary" style={{ marginLeft: '16px' }}>No station selected</Text>
//               )}
//             </Col>
//           </Row>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;