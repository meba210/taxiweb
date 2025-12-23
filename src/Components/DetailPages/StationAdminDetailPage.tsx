// src/pages/StationAdminDetail.tsx
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
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  UserOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import axios from 'axios';

type StationAdmin = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Stations: string;
};

export default function StationAdminDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<StationAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin details
  const fetchAdminDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/stationadmins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin details:', error);
      message.error('Failed to load admin details');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/stationAdmins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Station admin deleted successfully');
      navigate('/admin/StationAdmins');
    } catch (error) {
      console.error('Error deleting admin:', error);
      message.error('Failed to delete station admin');
    }
  };

  useEffect(() => {
    if (id) {
      fetchAdminDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!admin) {
    return (
      <Card className="shadow-sm">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600">Station Admin not found</h3>
          <Button 
            type="primary" 
            onClick={() => navigate('/admin/StationAdmins')}
            className="mt-4"
          >
            Back to Station Admins
          </Button>
        </div>
      </Card>
    );
  }

  const stationList = admin.Stations.split(',').map(s => s.trim());

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/admin/StationAdmins')}
          className="mr-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Station Admin Details</h1>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Admin Information */}
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex items-center mb-6">
              <Avatar 
                size={64}
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
                className="mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0">{admin.FullName}</h2>
                <p className="text-gray-500 m-0">@{admin.UserName}</p>
              </div>
            </div>

            <Descriptions 
              title="Personal Information" 
              bordered 
              column={{ xs: 1, sm: 2 }}
              size="middle"
            >
              <Descriptions.Item label="Full Name">
                <strong>{admin.FullName}</strong>
              </Descriptions.Item>
              
              <Descriptions.Item label="Username">
                <Tag color="blue">@{admin.UserName}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                <div className="flex items-center">
                  <MailOutlined className="mr-2 text-gray-400" />
                  <a href={`mailto:${admin.Email}`} className="text-blue-600 hover:text-blue-800">
                    {admin.Email}
                  </a>
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Phone">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2 text-gray-400" />
                  <span>0{admin.PhoneNumber}</span>
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Stations Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <EnvironmentOutlined className="mr-2 text-green-500" />
                Assigned Stations
              </h3>
              <div className="flex flex-wrap gap-2">
                {stationList.map((station, index) => (
                  <Badge 
                    key={index}
                    count={station}
                    style={{ 
                      backgroundColor: '#f6ffed',
                      color: '#389e0d',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #b7eb8f',
                      width:"100px",
                      height:"40px"
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column - Actions */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            
            <div className="space-y-3">
             
             

              <div className="space-y-3">
                <Button 
                  icon={<MailOutlined />}
                  block
                  className="text-left"
                  onClick={() => window.open(`mailto:${admin.Email}`)}
                >
                  Send Email
                </Button>
                
                <Button 
                  icon={<PhoneOutlined />}
                  block
                  className="text-left"
                  onClick={() => window.open(`tel:+${admin.PhoneNumber}`)}
                >
                  Call Station Admin
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}