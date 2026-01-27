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
} from 'antd';
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { TbRoute, TbBuildingEstate } from 'react-icons/tb';
import { RiUserSettingsLine } from 'react-icons/ri';
import axios from 'axios';

type UserDetail = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Stations?: string;
  Routes?: string;
  status?: string;
  CreatedAt?: string;
  Role: string;
  isActive?: boolean;
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'Station Admin' | 'Dispatcher'>(
    'Station Admin'
  );

  const token = localStorage.getItem('token');

  const fetchUserDetails = async () => {
    if (!token) {
      message.error('No authentication token found');
      return;
    }

    try {
      setLoading(true);

      const allUsersRes = await axios.get('http://localhost:5000/allUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allUser = allUsersRes.data.find((u: any) => u.id === Number(id));

      if (!allUser) {
        message.error('User not found');
        navigate('/admin/allUsers');
        return;
      }

      const role = allUser.Role;
      setUserRole(role);

      const baseUserData: UserDetail = {
        id: allUser.id,
        FullName: allUser.FullName,
        Email: allUser.Email,
        PhoneNumber: allUser.PhoneNumber,
        UserName: allUser.UserName,
        Role: role,
        status: allUser.status,
        isActive: String(allUser.status).toLowerCase() === 'active',
        Stations: allUser.Stations,
        Routes: allUser.Stations,
      };

      try {
        let detailedData = null;

        if (role === 'Station Admin') {
          const response = await axios.get(
            `http://localhost:5000/stationadmins/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          detailedData = response.data;
        } else if (role === 'Dispatcher') {
          const response = await axios.get(
            `http://localhost:5000/dispachers/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (Array.isArray(response.data) && response.data.length > 0) {
            detailedData = response.data[0];
          } else {
            detailedData = response.data;
          }
        }

        const mergedUser = {
          ...baseUserData,
          ...detailedData,

          Stations: role === 'Station Admin' ? allUser.Stations : undefined,
          Routes: role === 'Dispatcher' ? allUser.Stations : undefined,
        };

        setUser(mergedUser);
      } catch (detailedError) {
        console.log(
          'Using base user data, detailed fetch failed:',
          detailedError
        );
        setUser(baseUserData);
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      message.error(
        error.response?.data?.message || 'Failed to load user details'
      );
      navigate('/admin/allUsers');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (
    isActive: boolean | undefined,
    status: string | undefined
  ) => {
    if (isActive !== undefined) {
      return isActive
        ? { color: 'success', text: 'Active', icon: '●' }
        : { color: 'error', text: 'Inactive', icon: '●' };
    }

    if (status) {
      const statusLower = status.toLowerCase();
      if (statusLower === 'active') {
        return { color: 'success', text: 'Active', icon: '●' };
      } else if (statusLower === 'inactive') {
        return { color: 'error', text: 'Inactive', icon: '●' };
      }
    }

    return { color: 'default', text: 'Unknown', icon: '●' };
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getAssignments = () => {
    const assignments =
      userRole === 'Station Admin' ? user?.Stations : user?.Routes;
    if (!assignments || assignments.trim() === '') {
      return [];
    }
    return assignments.split(',').map((item) => item.trim());
  };

  const getBackRoute = () => '/admin/allUsers';

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="shadow-sm m-4 md:mx-6">
        <div className="text-center py-8 md:py-12">
          <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-4">
            User not found
          </h3>
          <Button
            type="primary"
            onClick={() => navigate(getBackRoute())}
            className="mt-2 md:mt-4"
          >
            Back to Users
          </Button>
        </div>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(user.isActive, user.status);
  const assignments = getAssignments();

  return (
    <div className="p-2 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <div className="flex items-center flex-wrap gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(getBackRoute())}
            className="mr-2"
            size="middle"
          >
            <span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
            {userRole} Details
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Tag
            color={userRole === 'Station Admin' ? 'green' : 'blue'}
            className="text-xs md:text-sm font-medium whitespace-nowrap"
          >
            {userRole}
          </Tag>
          <Badge
            status={statusInfo.color as any}
            text={statusInfo.text}
            className="text-xs md:text-sm"
          />
        </div>
      </div>

      <Row gutter={[16, 16]} className="w-full">
        <Col xs={24} lg={16}>
          <Card
            className="shadow-sm w-full"
            bodyStyle={{ padding: '12px 16px' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 md:mb-6 gap-4">
              <Avatar
                size={
                  { xs: 56, sm: 64, md: 72 }[
                    window.innerWidth < 640
                      ? 'xs'
                      : window.innerWidth < 768
                        ? 'sm'
                        : 'md'
                  ] as number
                }
                style={{
                  backgroundColor:
                    userRole === 'Station Admin' ? '#52c41a' : '#1890ff',
                  fontSize: '24px',
                }}
                icon={
                  userRole === 'Station Admin' ? (
                    <UserOutlined />
                  ) : (
                    <RiUserSettingsLine />
                  )
                }
                className="flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                  {user.FullName}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                  <span className="text-gray-500 text-sm md:text-base truncate">
                    @{user.UserName}
                  </span>
                </div>
              </div>
            </div>

            <Descriptions
              title={
                <span className="text-base md:text-lg">
                  Personal Information
                </span>
              }
              bordered
              column={{ xs: 1, sm: 2 }}
              size="middle"
              className="w-full"
              labelStyle={{
                fontWeight: 500,
                backgroundColor: '#fafafa',
                width: '120px',
              }}
            >
              <Descriptions.Item label="Full Name" span={2}>
                <strong className="text-sm md:text-base">
                  {user.FullName}
                </strong>
              </Descriptions.Item>

              <Descriptions.Item label="Username">
                <Tag color="blue" className="text-xs md:text-sm">
                  @{user.UserName}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Role">
                <Tag
                  color={userRole === 'Station Admin' ? 'green' : 'blue'}
                  className="text-xs md:text-sm"
                >
                  {userRole}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                <Space size="small">
                  <Badge
                    status={statusInfo.color as any}
                    text={
                      <span className="text-xs md:text-sm">
                        {statusInfo.text}
                      </span>
                    }
                  />
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Email" span={2}>
                <div className="flex items-center flex-wrap">
                  <MailOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${user.Email}`}
                    className="text-blue-600 hover:text-blue-800 text-sm md:text-base break-all"
                  >
                    {user.Email}
                  </a>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="Phone" span={2}>
                <div className="flex items-center flex-wrap">
                  <PhoneOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="text-sm md:text-base">
                    0{user.PhoneNumber}
                  </span>
                </div>
              </Descriptions.Item>

              {user.CreatedAt && (
                <Descriptions.Item label="Join Date" span={2}>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-sm md:text-base">
                      {formatDate(user.CreatedAt)}
                    </span>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider className="my-4 md:my-6" />

            {/* Assignments Section */}
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                {userRole === 'Station Admin' ? (
                  <>
                    <EnvironmentOutlined className="mr-2 text-green-500 text-lg" />
                    <span>Assigned Stations</span>
                  </>
                ) : (
                  <>
                    <TbRoute className="mr-2 text-blue-500 text-lg" />
                    <span>Assigned Routes</span>
                  </>
                )}
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {assignments.length > 0 ? (
                  assignments.map((assignment, index) => (
                    <Card
                      key={index}
                      size="small"
                      className="hover:shadow-md transition-shadow min-w-0 flex-1 sm:flex-none"
                      style={{
                        borderColor:
                          userRole === 'Station Admin' ? '#b7eb8f' : '#91d5ff',
                        backgroundColor:
                          userRole === 'Station Admin' ? '#f6ffed' : '#e6f7ff',
                        minWidth: '150px',
                        maxWidth: '100%',
                      }}
                      bodyStyle={{ padding: '8px 12px' }}
                    >
                      <div className="flex items-center">
                        {userRole === 'Station Admin' ? (
                          <TbBuildingEstate className="mr-2 text-green-500 text-base flex-shrink-0" />
                        ) : (
                          <TbRoute className="mr-2 text-blue-500 text-base flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-sm md:text-base truncate">
                            {assignment}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Active • Full Access
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="w-full py-4 text-center">
                    <p className="text-gray-500 text-sm md:text-base">
                      No {userRole === 'Station Admin' ? 'stations' : 'routes'}{' '}
                      assigned
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            className="shadow-sm mb-4 w-full"
            bodyStyle={{ padding: '12px 16px' }}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Quick Actions
            </h3>
            <Space direction="vertical" className="w-full" size="middle">
              <Button
                type="primary"
                block
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${user.Email}`)}
                size="middle"
                className="text-left"
              >
                Send Email
              </Button>

              <Button
                block
                icon={<PhoneOutlined />}
                onClick={() => window.open(`tel:+${user.PhoneNumber}`)}
                size="middle"
                className="text-left"
              >
                Call {userRole === 'Station Admin' ? 'Admin' : 'Dispatcher'}
              </Button>
            </Space>
          </Card>

          {/* Permissions Card */}
          <Card
            className="shadow-sm w-full"
            bodyStyle={{ padding: '12px 16px' }}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Permissions
            </h3>
            <Space direction="vertical" className="w-full" size="small">
              {userRole === 'Station Admin' ? (
                <>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded w-full">
                    <div className="flex items-center min-w-0">
                      <SafetyCertificateOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                      <div className="text-sm md:text-base truncate">
                        Station Management
                      </div>
                    </div>
                    <Badge
                      color="success"
                      text="Full"
                      className="flex-shrink-0"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded w-full">
                    <div className="flex items-center min-w-0">
                      <SafetyCertificateOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                      <div className="text-sm md:text-base truncate">
                        Report Access
                      </div>
                    </div>
                    <Badge
                      color="warning"
                      text="Limited"
                      className="flex-shrink-0"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded w-full">
                    <div className="flex items-center min-w-0">
                      <SafetyCertificateOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                      <div className="text-sm md:text-base truncate">
                        Route Management
                      </div>
                    </div>
                    <Badge
                      color="success"
                      text="Full"
                      className="flex-shrink-0"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded w-full">
                    <div className="flex items-center min-w-0">
                      <SafetyCertificateOutlined className="mr-2 text-gray-400 flex-shrink-0" />
                      <div className="text-sm md:text-base truncate">
                        Dispatch Control
                      </div>
                    </div>
                    <Badge
                      color="success"
                      text="Full"
                      className="flex-shrink-0"
                    />
                  </div>
                </>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
