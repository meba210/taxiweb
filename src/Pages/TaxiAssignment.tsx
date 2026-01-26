import { Button, Input, Table, Tag, Card, Badge, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { CiSearch, CiWarning } from 'react-icons/ci';
import { TbRoute, TbUsers } from 'react-icons/tb';
import { MdOutlineAssignment } from 'react-icons/md';
import { FaExclamationTriangle } from 'react-icons/fa';
import AssignTaxiModal from '../Components/modals/AssignTaxiModal';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';
import { LuCarTaxiFront } from 'react-icons/lu';

type RouteTaxi = {
  id: number;
  Routes: string;
  Taxis: number;
  WaitingCount: number;
};

export default function TaxAssignment() {
  const [searchText, setSearchText] = useState('');
  const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
  const [modalRouteId, setModalRouteId] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteTaxi | null>(null);
  const [loading, setLoading] = useState(false);

  const TAXI_CAPACITY = 15;

  const getDemandStatus = (passengers: number, taxis: number) => {
    const capacity = taxis * TAXI_CAPACITY;
    const utilization = passengers / capacity;

    if (utilization > 1) {
      return {
        status: 'high',
        text: 'High Demand',
        color: 'error',
        icon: <FaExclamationTriangle />,
      };
    }

    if (utilization <= 0.3) {
      return {
        status: 'oversupply',
        text: 'Too Many Taxis',
        color: 'cyan',
        icon: null,
      };
    }

    if (utilization >= 0.8) {
      return {
        status: 'medium',
        text: 'Near Capacity',
        color: 'warning',
        icon: <CiWarning />,
      };
    }

    return {
      status: 'normal',
      text: 'Normal',
      color: 'success',
      icon: null,
    };
  };

  const columns: ColumnsType<RouteTaxi> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbRoute className="text-lg" />
          <span>ROUTE</span>
        </div>
      ),
      dataIndex: 'Routes',
      key: 'Routes',
      render: (text) => <div className="font-medium text-gray-800">{text}</div>,
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <LuCarTaxiFront className="text-lg" />
          <span>AVAILABLE TAXIS</span>
        </div>
      ),
      dataIndex: 'Taxis',
      key: 'Taxis',
      render: (taxis) => (
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full ${
              taxis < 3 ? 'bg-red-100' : 'bg-green-100'
            } flex items-center justify-center mr-2`}
          >
            <span
              className={`font-bold ${
                taxis < 3 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {taxis}
            </span>
          </div>
          <span
            className={taxis < 3 ? 'text-red-600 font-medium' : 'text-gray-700'}
          >
            {taxis} {taxis === 1 ? 'taxi' : 'taxis'}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbUsers className="text-lg" />
          <span>WAITING PASSENGERS</span>
        </div>
      ),
      dataIndex: 'WaitingCount',
      key: 'Passengers',
      render: (passengers) => {
        const count = passengers || 0;

        return (
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${
                count > 30 ? 'bg-orange-100' : 'bg-blue-100'
              } flex items-center justify-center mr-2`}
            >
              <span
                className={`font-bold ${
                  count > 30 ? 'text-orange-600' : 'text-blue-600'
                }`}
              >
                {count}
              </span>
            </div>
            <span
              className={
                count > 30 ? 'text-orange-600 font-medium' : 'text-gray-700'
              }
            >
              {count} {count === 1 ? 'passenger' : 'passengers'}
            </span>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiWarning className="text-lg" />
          <span>DEMAND STATUS</span>
        </div>
      ),
      key: 'demandStatus',
      render: (_: any, record: RouteTaxi) => {
        const demand = getDemandStatus(record.WaitingCount, record.Taxis);
        return (
          <Tooltip title={demand.text}>
            <Tag
              color={demand.color}
              icon={demand.icon}
              className="flex items-center gap-1 font-medium"
            >
              {demand.text}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_: any, record: RouteTaxi) => {
        const demand = getDemandStatus(record.WaitingCount, record.Taxis);
        return (
          <Button
            type="primary"
            icon={<MdOutlineAssignment />}
            onClick={() => {
              setSelectedRoute(record);
              setModalRouteId(record.id);
            }}
            className={
              demand.status === 'high'
                ? 'bg-gradient-to-r from-red-600 to-red-500 border-0'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 border-0'
            }
            size="small"
          >
            Assign
          </Button>
        );
      },
    },
  ];

  const filteredData = routeTaxiList.filter((item) =>
    item.Routes.toLowerCase().includes(searchText.toLowerCase())
  );

  const highDemandRouteList = routeTaxiList.filter(
    (item) => getDemandStatus(item.WaitingCount, item.Taxis).status === 'high'
  );

  const oversupplyRoutes = routeTaxiList.filter(
    (item) =>
      getDemandStatus(item.WaitingCount, item.Taxis).status === 'oversupply'
  );

  const fetchTaxiAssignment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/taxiAssignment', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRouteTaxiList(res.data);
    } catch (err) {
      console.error('Failed to fetch taxi assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxiAssignment();
    const interval = setInterval(fetchTaxiAssignment, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {(highDemandRouteList.length > 0 || oversupplyRoutes.length > 0) && (
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
          <div className="p-1 bg-gradient-to-r from-blue-50 to-white">
            <div className="space-y-4 p-4">
              {highDemandRouteList.length > 0 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 border border-red-100 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 flex items-center gap-2">
                      High Demand Detected
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                        {highDemandRouteList.length} route
                        {highDemandRouteList.length > 1 ? 's' : ''}
                      </span>
                    </h4>
                    <p className="text-red-600 mt-1">
                      Increased passenger demand detected on:
                      <span className="font-medium ml-1">
                        {highDemandRouteList.map((r) => r.Routes).join(', ')}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {oversupplyRoutes.length > 0 && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-50 border border-cyan-100 shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-cyan-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-700 flex items-center gap-2">
                      Taxi Oversupply Alert
                      <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-100 text-cyan-800 rounded-full">
                        {oversupplyRoutes.length} route
                        {oversupplyRoutes.length > 1 ? 's' : ''}
                      </span>
                    </h4>
                    <p className="text-cyan-600 mt-1">
                      More taxis than needed on:
                      <span className="font-medium ml-1">
                        {oversupplyRoutes.map((r) => r.Routes).join(', ')}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      <Card className="shadow-sm border-0 mb-6" bodyStyle={{ padding: '20px' }}>
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by route name..."
          prefix={<CiSearch />}
          allowClear
        />
      </Card>

      <Card className="shadow-sm border-0">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ showSizeChanger: true }}
        />
      </Card>

      {modalRouteId && selectedRoute && (
        <AssignTaxiModal
          isModalOpen
          routeId={modalRouteId}
          routeName={selectedRoute.Routes}
          onClose={() => {
            setModalRouteId(null);
            setSelectedRoute(null);
          }}
          onAssigned={fetchTaxiAssignment}
        />
      )}
    </>
  );
}
