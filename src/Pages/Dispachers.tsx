import {
  Button,
  Input,
  Table,
  Tag,
  Card,
  Space,
  message,
  Tooltip,
  Badge,
} from 'antd';
import { useEffect, useState } from 'react';
import { CiSearch, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import EditDispachersModal from '../Components/modals/EditDispachers';
import { TbEdit, TbUser, TbRoute } from 'react-icons/tb';
import { MdOutlinePersonAddAlt } from 'react-icons/md';
import axios from 'axios';
import CreateDispachers from '../Components/modals/CreateDispachers';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

type Dispatcher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  UserName: string;
  Routes: string;
};

export default function Dispachers() {
  const [IsCreateDispachersOpen, setIsCreateDispachersOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [EditingDispachers, setEditingDispachers] = useState<Dispatcher | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    message.warning('Authentication required');
  }

  const showCreateDispatcher = () => {
    setIsCreateDispachersOpen(true);
  };

  const closeCreateDispatcher = () => {
    setIsCreateDispachersOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleEdit = (dispatcher: Dispatcher) => {
    setEditingDispachers(dispatcher);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDispachers(null);
  };

  const handleDispatcherUpdated = (updatedDispatcher: Dispatcher) => {
    setDispatchers((prev) =>
      prev.map((d) => (d.id === updatedDispatcher.id ? updatedDispatcher : d))
    );
    message.success('Dispatcher updated successfully');
  };

  const columns: ColumnsType<Dispatcher> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbUser className="text-lg" />
          <span>FULL NAME</span>
        </div>
      ),
      dataIndex: 'FullName',
      key: 'name',
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
      key: 'email',
      responsive: ['md'],
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <CiMail className="mr-2 text-gray-400" />
          <span className="truncate">{text}</span>
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
      key: 'phone',
      responsive: ['md'],
      render: (text) => {
        const phoneStr = String(text);
        const formatted = phoneStr.startsWith('09')
          ? phoneStr
          : phoneStr.startsWith('+2519')
          ? phoneStr
          : phoneStr.startsWith('2519')
          ? `+${phoneStr}`
          : phoneStr.startsWith('9') && phoneStr.length === 9
          ? `0${phoneStr}`
          : phoneStr;

        return (
          <div className="flex items-center text-gray-600">
            <CiPhone className="mr-2 text-gray-400" />
            <span>{formatted}</span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiUser className="text-lg" />
          <span>USERNAME</span>
        </div>
      ),
      dataIndex: 'UserName',
      key: 'username',
      responsive: ['md'],
      render: (text) => (
        <Tag color="blue" className="font-mono">
          @{text}
        </Tag>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbRoute className="text-lg" />
          <span>ASSIGNED ROUTE</span>
        </div>
      ),
      dataIndex: 'Routes',
      key: 'routes',
      responsive: ['md'],
      render: (routes) => {
        if (!routes) return <Tag color="default">No route assigned</Tag>;

        const routeArray = routes.split(',').map((r: string) => r.trim());
        return (
          <div className="flex flex-wrap gap-1">
            {routeArray.slice(0, 2).map((route: string, index: number) => (
              <Tag key={index} color="green" className="text-xs">
                {route}
              </Tag>
            ))}
            {routeArray.length > 2 && (
              <Tooltip title={routeArray.slice(2).join(', ')}>
                <Tag color="default" className="text-xs">
                  +{routeArray.length - 2} more
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_: any, record: Dispatcher) => (
        <Space
          size="small"
          className="flex flex-col sm:flex-row gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit dispatcher">
            <Button
              type="text"
              size="small"
              icon={<TbEdit color="blue" />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredDispatchers = dispatchers.filter(
    (dispatcher) =>
      dispatcher.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
      dispatcher.Email.toLowerCase().includes(searchText.toLowerCase()) ||
      dispatcher.UserName.toLowerCase().includes(searchText.toLowerCase()) ||
      dispatcher.PhoneNumber.includes(searchText)
  );

  const fetchDispatchers = async () => {
    if (!token) {
      message.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/dispachers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedDispatchers = res.data.map((dispatcher: any) => ({
        ...dispatcher,
        PhoneNumber: String(dispatcher.PhoneNumber || ''),
      }));

      setDispatchers(mappedDispatchers);
    } catch (err: any) {
      console.error('Failed to fetch dispatchers:', err);
      message.error(
        err.response?.data?.message || 'Failed to fetch dispatchers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchers();
  }, []);

  const handleRowClick = (record: Dispatcher) => {
    navigate(`/stationAdmin/Dispachers/${record.id}`);
  };

  return (
    <>
      <Card
        className="shadow-sm border-0 mb-4 md:mb-6"
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search dispatchers..."
            className="rounded-lg h-10 border-gray-300 focus:border-blue-500 w-full md:w-auto md:flex-1 md:max-w-sm"
            prefix={<CiSearch className="text-gray-400" />}
            allowClear
            size="middle"
          />

          <Button
            type="primary"
            onClick={showCreateDispatcher}
            icon={<MdOutlinePersonAddAlt />}
            className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 w-full md:w-auto"
            size="middle"
          >
            <span className="hidden sm:inline">Create Dispatcher</span>
            <span className="sm:hidden">New Dispatcher</span>
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
                count={filteredDispatchers.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">
                Total Dispatchers
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredDispatchers.length} of {dispatchers.length} displayed
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDispatchers}
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

      {IsCreateDispachersOpen && (
        <CreateDispachers
          isModalOpen={IsCreateDispachersOpen}
          handleCancel={closeCreateDispatcher}
          onDispachersCreated={fetchDispatchers}
        />
      )}

      {isEditModalOpen && EditingDispachers && (
        <EditDispachersModal
          isOpen={isEditModalOpen}
          handleCancel={closeEditModal}
          Dispacher={EditingDispachers}
          onUpdated={handleDispatcherUpdated}
        />
      )}
    </>
  );
}
