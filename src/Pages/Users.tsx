import { Input, Table, Tag, Card, message, Badge, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { CiSearch, CiMail, CiPhone } from 'react-icons/ci';
import { TbUser, TbBuildingEstate } from 'react-icons/tb';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

type User = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Role: string;
  isActive: boolean;
};

export default function AllUsers() {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/allUsers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersWithStatus = res.data.map((user: any) => ({
        ...user,
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

  const roleMap: Record<string, string> = {
    'Station Admin': 'stationadmin',
    Dispatcher: 'dispatcher',
  };

  const handleStatusChange = async (record: User, checked: boolean) => {
    try {
      const role = roleMap[record.Role];

      await axios.put(
        `http://localhost:5000/allUsers/${role}/${record.id}/status`,
        { isActive: checked }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === record.id && u.Role === record.Role
            ? { ...u, isActive: checked }
            : u
        )
      );

      message.success(`User is now ${checked ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error(err);
      message.error('Failed to update status');
    }
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
          <CiPhone className="mr-2 text-gray-400" />
          {text}
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
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'STATUS',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleStatusChange(record, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.UserName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Card className="shadow-sm border-0 mb-6" bodyStyle={{ padding: '20px' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or username..."
            className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
            prefix={<CiSearch className="text-gray-400" />}
            allowClear
            style={{ minWidth: '250px' }}
          />
        </div>
      </Card>

      <Card className="shadow-sm border-0 overflow-hidden">
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
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            className: 'px-4 md:px-6',
            responsive: true,
          }}
          scroll={{ x: true }}
        />
      </Card>
    </>
  );
}
