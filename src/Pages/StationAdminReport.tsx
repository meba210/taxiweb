import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  Button,
  Statistic,
  Progress,
  Tabs,
  Radio,
  Space,
  Tag,
  Modal,
  Alert,
  Empty
} from 'antd';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  DownloadOutlined,
  FilterOutlined,
  PrinterOutlined,
  ReloadOutlined,
  EyeOutlined,
  DollarOutlined,
  TeamOutlined,
  CarOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const ReportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [reportType, setReportType] = useState('daily');
  const [stations, setStations] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [timeFrame, setTimeFrame] = useState('week');

  // Mock data for charts (replace with your API data)
  const revenueData = [
    { date: 'Mon', revenue: 4200 },
    { date: 'Tue', revenue: 5200 },
    { date: 'Wed', revenue: 3800 },
    { date: 'Thu', revenue: 6100 },
    { date: 'Fri', revenue: 7200 },
    { date: 'Sat', revenue: 5800 },
    { date: 'Sun', revenue: 4900 },
  ];

  const stationPerformanceData = [
    { name: 'Mexico', trips: 245, revenue: 12450, efficiency: 94 },
    { name: 'Jemo', trips: 189, revenue: 9450, efficiency: 88 },
    { name: 'Bole', trips: 312, revenue: 15600, efficiency: 91 },
    { name: 'Megenagna', trips: 156, revenue: 7800, efficiency: 85 },
    { name: 'Sarbet', trips: 278, revenue: 13900, efficiency: 92 },
  ];

  const tripStatusData = [
    { name: 'Completed', value: 1245, color: '#10b981' },
    { name: 'In Progress', value: 78, color: '#3b82f6' },
    { name: 'Cancelled', value: 45, color: '#ef4444' },
    { name: 'Pending', value: 32, color: '#f59e0b' },
  ];

  const peakHoursData = [
    { hour: '6-8 AM', trips: 45 },
    { hour: '8-10 AM', trips: 128 },
    { hour: '10-12 PM', trips: 96 },
    { hour: '12-2 PM', trips: 87 },
    { hour: '2-4 PM', trips: 134 },
    { hour: '4-6 PM', trips: 198 },
    { hour: '6-8 PM', trips: 156 },
    { hour: '8-10 PM', trips: 89 },
  ];

  // KPI Cards Data
  const kpiData = {
    totalTrips: 1458,
    totalRevenue: 72650,
    avgWaitTime: 8.2,
    assignmentRate: 94.3,
    activeTaxis: 42,
    satisfiedCustomers: 92,
  };

  // Table columns
  const stationColumns = [
    {
      title: 'Station',
      dataIndex: 'name',
      key: 'name',
      render: (text:any) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Total Trips',
      dataIndex: 'trips',
      key: 'trips',
     // sorter: (a, b) => a.trips - b.trips,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text:any) => `$${text.toLocaleString()}`,
      //sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Efficiency',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (text:any) => (
        <div className="flex items-center">
          <Progress percent={text} size="small" strokeColor="#10b981" />
          <span className="ml-2">{text}%</span>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_:any, record:any) => (
        <Tag color={record.efficiency > 90 ? 'success' : record.efficiency > 80 ? 'warning' : 'error'}>
          {record.efficiency > 90 ? 'Excellent' : record.efficiency > 80 ? 'Good' : 'Needs Improvement'}
        </Tag>
      ),
    },
  ];

  const recentTripsColumns = [
    {
      title: 'Trip ID',
      dataIndex: 'id',
      key: 'id',
      render: (text:any) => <span className="text-blue-600">#{text}</span>,
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      render: (text:any) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Dispatcher',
      dataIndex: 'dispatcher',
      key: 'dispatcher',
    },
    {
      title: 'Taxi',
      dataIndex: 'taxi',
      key: 'taxi',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text:any) => {
        const colors = {
          Completed: 'green',
          'In Progress': 'blue',
          Pending: 'orange',
          Cancelled: 'red',
        };
        return <Tag >{text}</Tag>;
      },
    },
  ];

  const recentTripsData = [
    { id: 'TRP001', route: 'Mexico → Jemo', dispatcher: 'John D.', taxi: 'TAXI-789', time: '10:24 AM', status: 'Completed' },
    { id: 'TRP002', route: 'Bole → Megenagna', dispatcher: 'Sarah M.', taxi: 'TAXI-456', time: '10:32 AM', status: 'In Progress' },
    { id: 'TRP003', route: 'Sarbet → Mexico', dispatcher: 'Mike R.', taxi: 'TAXI-123', time: '10:45 AM', status: 'Completed' },
    { id: 'TRP004', route: 'Jemo → Bole', dispatcher: 'Lisa T.', taxi: 'TAXI-987', time: '11:05 AM', status: 'Pending' },
    { id: 'TRP005', route: 'Megenagna → Sarbet', dispatcher: 'Alex K.', taxi: 'TAXI-654', time: '11:20 AM', status: 'Completed' },
  ];

  // Fetch stations data
  useEffect(() => {
    fetchStations();
    fetchReportData();
  }, []);

  const fetchStations = async () => {
    try {
      // Replace with your API call
      const mockStations = [
        { id: 'all', name: 'All Stations' },
        { id: 'mexico', name: 'Mexico' },
        { id: 'jemo', name: 'Jemo' },
        { id: 'bole', name: 'Bole' },
        { id: 'megenagna', name: 'Megenagna' },
        { id: 'sarbet', name: 'Sarbet' },
      ];
      //setStations(mockStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      setTimeout(() => {
       // setReportData({ message: 'Report data loaded' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

//   const handleExport = (format) => {
//     console.log(`Exporting as ${format}`);
//     setExportModalVisible(false);
//     // Add your export logic here
//   };

  const ExportModal = () => (
    <Modal
      title="Export Report"
      open={exportModalVisible}
      onCancel={() => setExportModalVisible(false)}
      footer={null}
    >
      <div className="space-y-4">
        <p className="text-gray-600">Choose export format:</p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            icon={<DownloadOutlined />}
            size="large"
           // onClick={() => handleExport('PDF')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-lg font-medium">PDF</span>
            <span className="text-gray-500 text-sm">For Printing</span>
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="large"
           // onClick={() => handleExport('Excel')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-lg font-medium">Excel</span>
            <span className="text-gray-500 text-sm">For Analysis</span>
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="large"
           // onClick={() => handleExport('CSV')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-lg font-medium">CSV</span>
            <span className="text-gray-500 text-sm">Raw Data</span>
          </Button>
          <Button
            icon={<PrinterOutlined />}
            size="large"
            //onClick={() => handleExport('Print')}
            className="flex flex-col items-center justify-center h-24"
          >
            <span className="text-lg font-medium">Print</span>
            <span className="text-gray-500 text-sm">Direct Print</span>
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Station Reports</h1>
            <p className="text-gray-600">Monitor performance, trips, and dispatcher efficiency</p>
          </div>
          <div className="flex space-x-3">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchReportData}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => setExportModalVisible(true)}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              {/* <RangePicker
                value={dateRange}
                onChange={setDateRange}
                className="w-64"
              /> */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
              <Select
                value={selectedStation}
                onChange={setSelectedStation}
                className="w-48"
              >
                {/* {stations.map(station => (
                  <Option 
                  key={station.id} value={station.id}>
                    {station.name}
                  </Option>
                ))} */}
              </Select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <Radio.Group value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <Radio.Button value="daily">Daily</Radio.Button>
                <Radio.Button value="weekly">Weekly</Radio.Button>
                <Radio.Button value="monthly">Monthly</Radio.Button>
              </Radio.Group>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Frame</label>
              <Select
                value={timeFrame}
                onChange={setTimeFrame}
                className="w-32"
              >
                <Option value="today">Today</Option>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="quarter">This Quarter</Option>
                <Option value="year">This Year</Option>
              </Select>
            </div>
            <Button
              type="primary"
              icon={<FilterOutlined />}
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* KPI Cards */}
      {/* <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Trips"
              value={kpiData.totalTrips}
              prefix={<TeamOutlined className="text-blue-500" />}
              suffix={<span className="text-green-500 text-sm">+12%</span>}
            />
            <div className="mt-2 text-sm text-gray-500">Completed trips this week</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              value={kpiData.totalRevenue}
              prefix={<DollarOutlined className="text-green-500" />}
              formatter={(value) => `$${value.toLocaleString()}`}
              suffix={<span className="text-green-500 text-sm">+8.5%</span>}
            />
            <div className="mt-2 text-sm text-gray-500">Revenue generated</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Avg Wait Time"
              value={kpiData.avgWaitTime}
              prefix={<ScheduleOutlined className="text-purple-500" />}
              suffix="mins"
            />
            <div className="mt-2">
              <Progress
                percent={82}
                size="small"
                strokeColor={kpiData.avgWaitTime < 10 ? '#10b981' : '#f59e0b'}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Assignment Rate"
              value={kpiData.assignmentRate}
              prefix={<CheckCircleOutlined className="text-emerald-500" />}
              suffix="%"
            />
            <div className="mt-2 flex items-center text-sm">
              <RiseOutlined className="text-green-500 mr-1" />
              <span className="text-green-500">+2.3% from last week</span>
            </div>
          </Card>
        </Col>
      </Row> */}

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={12}>
          <Card 
            title="Revenue Trend" 
            extra={<Button type="text" icon={<EyeOutlined />}>Details</Button>}
            className="h-full"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fill="#93c5fd" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Station Performance"
            extra={<Button type="text" icon={<EyeOutlined />}>Compare</Button>}
            className="h-full"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`$${value}`, 'Revenue'];
                      if (name === 'efficiency') return [`${value}%`, 'Efficiency'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="trips" name="Trips" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card className="mb-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Station Overview" key="1">
            <Table
              columns={stationColumns}
              dataSource={stationPerformanceData}
              pagination={false}
              rowKey="name"
            />
          </TabPane>
          <TabPane tab="Trip Status" key="2">
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tripStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tripStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Trips']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h3 className="text-lg font-medium mb-4">Peak Hours Analysis</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={peakHoursData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hour" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="trips" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Col>
            </Row>
          </TabPane>
          {/* <TabPane tab="Recent Trips" key="3">
            <Table
              columns={recentTripsColumns}
              dataSource={recentTripsData}
              pagination={{ pageSize: 5 }}
              rowKey="id"
            />
          </TabPane> */}
          {/* <TabPane tab="Dispatcher Performance" key="4">
            <div className="text-center py-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500">
                    Dispatcher performance data will be available soon
                  </span>
                }
              />
            </div>
          </TabPane> */}
        </Tabs>
      </Card>

     

      {/* Footer Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <Button
          icon={<PrinterOutlined />}
          size="large"
          onClick={() => window.print()}
        >
          Print Report
        </Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={() => setExportModalVisible(true)}
        >
          Download Full Report
        </Button>
      </div>

      {/* Export Modal */}
      <ExportModal />

      {/* Last Updated */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Last updated: {new Date().toLocaleString()} | Data refreshes every 5 minutes
      </div>
    </div>
  );
};

export default ReportsPage;