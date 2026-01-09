import {
  Button,
  Input,
  Table,
  Card,
  Space,
  message,
  Tooltip,
  Badge,
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CiSearch, CiLocationArrow1, CiRoute } from 'react-icons/ci';
import { TbEdit, TbRoute } from 'react-icons/tb';
import { MdOutlineAddRoad } from 'react-icons/md';
import EditRoutesModal from '../Components/modals/EditRoutesModal';
import CreateRoutes from '../Components/modals/CreateRoutes';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

type Route = {
  id: number;
  EndTerminal: string;
  station_name?: string;
  StartTerminal?: string;
};

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchText, setSearchText] = useState('');
  const [IsCreateRoutesOpen, setIsCreateRoutesOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('No token found! Login required.');
  }

  const fetchRoutes = async () => {
    if (!token) {
      message.error('Please login again');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/routes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedRoutes = res.data.map((route: any) => ({
        id: route.id,
        station_name:
          route.station_name || route.StartTerminal || 'Unknown Station',
        EndTerminal: route.EndTerminal || 'Unknown Destination',
        ...route,
      }));

      setRoutes(mappedRoutes);
    } catch (err: any) {
      console.error('Failed to fetch routes:', err.response?.data || err);
      message.error(err.response?.data?.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRoute(null);
  };

  const handleRouteUpdated = () => fetchRoutes();

  const filteredRoutes = routes.filter(
    (route) =>
      route.station_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      route.EndTerminal.toLowerCase().includes(searchText.toLowerCase())
  );

  const showCreateRoutes = () => setIsCreateRoutesOpen(true);
  const closeCreateRoutes = () => setIsCreateRoutesOpen(false);

  const columns: ColumnsType<Route> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiLocationArrow1 className="text-lg text-green-500" />
          <span>START TERMINAL</span>
        </div>
      ),
      dataIndex: 'station_name',
      key: 'station_name',
      responsive: ['md'],
      render: (text) => (
        <div className="font-medium text-gray-800">{text || 'N/A'}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiLocationArrow1 className="text-lg text-red-500" />
          <span>END TERMINAL</span>
        </div>
      ),
      dataIndex: 'EndTerminal',
      key: 'EndTerminal',
      responsive: ['md'],
      render: (text) => <div className="font-medium text-gray-800">{text}</div>,
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiRoute className="text-lg text-blue-500" />
          <span>ROUTE</span>
        </div>
      ),
      key: 'routePath',
      responsive: ['md'],
      render: (_, record) => (
        <div className="flex items-center text-gray-600">
          <span className="font-medium">
            {record.station_name || 'Start Terminal'}
          </span>
          <TbRoute className="mx-2 text-gray-400" />
          <span className="font-medium">{record.EndTerminal}</span>
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_: any, record: Route) => (
        <Space
          size="small"
          className="flex flex-col sm:flex-row gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit route">
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

  const handleRowClick = (record: Route) => {
    navigate(`/stationAdmin/Routes/${record.id}`);
  };

  return (
    <>
      <Card
        className="shadow-sm border-0 mb-4 md:mb-6"
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search routes..."
            className="rounded-lg h-10 border-gray-300 focus:border-blue-500 w-full sm:flex-1 sm:max-w-sm"
            prefix={<CiSearch className="text-gray-400" />}
            allowClear
            size="middle"
          />

          <Button
            type="primary"
            onClick={showCreateRoutes}
            icon={<MdOutlineAddRoad />}
            className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 w-full sm:w-auto"
            size="middle"
          >
            <span className="hidden sm:inline">Create Route</span>
            <span className="sm:hidden">New Route</span>
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
                count={filteredRoutes.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">Total Routes</span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredRoutes.length} of {routes.length} displayed
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRoutes}
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

      {IsCreateRoutesOpen && (
        <CreateRoutes
          isModalOpen={IsCreateRoutesOpen}
          handleCancel={closeCreateRoutes}
          onRoutesCreated={fetchRoutes}
        />
      )}

      {isEditModalOpen && editingRoute && (
        <EditRoutesModal
          isOpen={isEditModalOpen}
          handleCancel={closeEditModal}
          route={editingRoute}
          onUpdated={handleRouteUpdated}
        />
      )}
    </>
  );
}
