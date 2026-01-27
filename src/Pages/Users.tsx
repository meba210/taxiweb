import {
  Input,
  Table,
  Tag,
  Card,
  message,
  Badge,
  Switch,
  Button,
  Space,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { CiSearch, CiMail, CiPhone } from 'react-icons/ci';
import { TbUser, TbBuildingEstate, TbEdit, TbRoute } from 'react-icons/tb';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import CreateUserModal from '../Components/modals/CreateStationAdmin';
import EditUserModal from '../Components/modals/EditStationAdminModal';

type User = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Role: string;
  isActive: boolean;
  Stations?: string;
};

export default function AllUsers() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/allUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response sample:', res.data.slice(0, 2));

      const usersWithStatus = res.data.map((user: any) => ({
        id: user.id,
        FullName: user.FullName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        UserName: user.UserName,
        Role: user.Role,
        Stations: user.Stations || null,
        isActive: String(user.status).toLowerCase() === 'active',
      }));

      setUsers(usersWithStatus);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => setSearchText(value);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    message.success('User updated successfully');
  };

  const handleUserCreated = () => {
    fetchUsers();
    message.success('User created successfully');
  };

 
  const handleRowClick = (record: User) => {
    navigate(`/admin/allUsers/${record.id}`);
  };

 
  const roleMap: Record<string, string> = {
    'Station Admin': 'stationadmin',
    Dispatcher: 'dispatcher',
  };

  const handleStatusChange = async (record: User, checked: boolean) => {
    try {
      const role = roleMap[record.Role];

      if (!role) {
        message.error(`Unknown role: ${record.Role}`);
        return;
      }

      const token = localStorage.getItem('token');

      // Use the correct endpoint from original file
      const res = await axios.put(
        `http://localhost:5000/allUsers/${role}/${record.id}/status`,
        { isActive: checked },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === record.id && u.Role === record.Role
            ? { ...u, isActive: checked }
            : u
        )
      );

      message.success(`User is now ${checked ? 'Active' : 'Inactive'}`);
    } catch (err: any) {
      console.error('Status change error:', err);


      if (err.response?.status === 404) {
        message.error(`User not found or endpoint doesn't exist`);
      } else if (err.response?.status === 401) {
        message.error('Unauthorized. Please login again.');
      } else if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error('Failed to update status');
      }


      setUsers((prev) =>
        prev.map((u) =>
          u.id === record.id && u.Role === record.Role
            ? { ...u, isActive: !checked }
            : u
        )
      );
    }
  };

  const renderAssignments = (record: User) => {
    if (!record.Stations || record.Stations.trim() === '') {
      return (
        <Tag color="default" className="text-xs">
          Not assigned
        </Tag>
      );
    }

    if (record.Role === 'Station Admin') {
      const stations = record.Stations.includes(',')
        ? record.Stations.split(',').map((s: string) => s.trim())
        : [record.Stations];

      return (
        <div className="flex flex-wrap gap-1">
          {stations.map((station: string, index: number) => (
            <Tag key={index} color="green" className="text-xs">
              <TbBuildingEstate className="inline mr-1" />
              {station}
            </Tag>
          ))}
        </div>
      );
    }

    if (record.Role === 'Dispatcher') {
      const routes = record.Stations.includes(',')
        ? record.Stations.split(',').map((r: string) => r.trim())
        : [record.Stations];

      return (
        <div className="flex flex-wrap gap-1">
          {routes.map((route: string, index: number) => (
            <Tag key={index} color="blue" className="text-xs">
              <TbRoute className="inline mr-1" />
              {route}
            </Tag>
          ))}
        </div>
      );
    }

    return (
      <Tag color="default" className="text-xs">
        Not assigned
      </Tag>
    );
  };

  const columns: ColumnsType<User> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbUser className="text-lg" />
          <span>FULL NAME</span>
        </div>
      ),
      dataIndex: 'FullName',
      key: 'FullName',
      responsive: ['md'],
      render: (text) => <div className="font-medium text-gray-800">{text}</div>,
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiMail className="text-lg" />
          <span>EMAIL</span>
        </div>
      ),
      dataIndex: 'Email',
      key: 'Email',
      responsive: ['md'],
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <CiMail className="mr-2 text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiPhone className="text-lg" />
          <span>PHONE</span>
        </div>
      ),
      dataIndex: 'PhoneNumber',
      key: 'PhoneNumber',
      responsive: ['md'],
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <CiPhone className="mr-2 text-gray-400" />0{text}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbUser className="text-lg" />
          <span>USERNAME</span>
        </div>
      ),
      dataIndex: 'UserName',
      key: 'UserName',
      responsive: ['md'],
      render: (text) => <Tag color="default">@{text}</Tag>,
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbBuildingEstate className="text-lg" />
          <span>ROLE</span>
        </div>
      ),
      dataIndex: 'Role',
      key: 'Role',
      responsive: ['md'],
      render: (text) => {
        let color = 'blue';
        if (text === 'Station Admin') color = 'green';
        if (text === 'Dispatcher') color = 'orange';
        if (text === 'Super Admin') color = 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbBuildingEstate className="text-lg" />
          <span>ASSIGNMENTS</span>
        </div>
      ),
      key: 'assignments',
      responsive: ['md'],
      render: (_, record) => renderAssignments(record),
    },
    {
      title: 'STATUS',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={record.isActive}
            onChange={(checked) => handleStatusChange(record, checked)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            loading={loading}
          />
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space
          size="small"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Tooltip title="Edit user">
            <Button
              type="text"
              size="small"
              icon={<TbEdit />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.UserName.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.Stations &&
        user.Stations.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <>
      <Card
        className="shadow-sm border-0 mb-4 md:mb-6"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users by name, email, username, or assignments..."
            className="rounded-lg h-10 border-gray-300 focus:border-blue-500 w-full sm:flex-1 sm:max-w-sm md:max-w-md"
            prefix={<CiSearch className="text-gray-400" />}
            allowClear
            size="middle"
          />

          <Button
            type="primary"
            onClick={showCreateModal}
            icon={<MdOutlineAdminPanelSettings />}
            className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 w-full sm:w-auto"
            size="middle"
          >
            <span className="hidden sm:inline">Create User</span>
            <span className="sm:hidden">+ New User</span>
          </Button>
        </div>
      </Card>

      <Card
        className="shadow-sm border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Badge
                count={filteredUsers.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">Total Users</span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} of {users.length} displayed
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: {
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            },
            onMouseEnter: (event: React.MouseEvent) => {
              const row = event.currentTarget as HTMLElement;
              row.style.backgroundColor = '#f8fafc';
            },
            onMouseLeave: (event: React.MouseEvent) => {
              const row = event.currentTarget as HTMLElement;
              row.style.backgroundColor = '';
            },
          })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            className: 'px-4 md:px-6',
            responsive: true,
          }}
          scroll={{ x: true }}
          className="ant-table-striped"
          rowClassName={(_, index) => (index % 2 === 0 ? 'bg-gray-50/50' : '')}
          style={{
            backgroundColor: 'transparent',
          }}
          components={{
            body: {
              cell: (props: any) => (
                <td {...props} className="border-b border-gray-100" />
              ),
            },
          }}
        />
      </Card>

      {isCreateModalOpen && (
        <CreateUserModal
          isModalOpen={isCreateModalOpen}
          handleCancel={closeCreateModal}
          onUserCreated={handleUserCreated}
        />
      )}

      {isEditModalOpen && editingUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          handleCancel={closeEditModal}
          user={editingUser}
          onUpdated={handleUserUpdated}
        />
      )}
    </>
  );
}
