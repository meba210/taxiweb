
// import { Button, Input, Table } from "antd";
// import { useEffect, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import AssignTaxiModal from "../Components/modals/AssignTaxiModal";
// import axios from "axios";

// type RouteTaxi = {
//   id: number;
//   Routes: string;
//   Taxis: number;
//   WaitingCount: number;
// };

// export default function TaxAssignment() {
//   const [searchText, setSearchText] = useState("");
//   const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
//   const [modalRouteId, setModalRouteId] = useState<number | null>(null);
//   const [selectedRoute, setSelectedRoute] = useState<RouteTaxi | null>(null);

//   const columns = [
//     { title: "Routes", dataIndex: "Routes", key: "Routes" },
//     { title: "Available Taxis", dataIndex: "Taxis", key: "Taxis" },
//     { title: "Passengers", dataIndex: "WaitingCount", key: "Passengers" },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: RouteTaxi) => (
//         <Button
//           type="primary"
//           onClick={() => {
//             setSelectedRoute(record);
//             setModalRouteId(record.id);
//           }}
//         >
//           Assign
//         </Button>
//       ),
//     },
//   ];

//   const filteredData = routeTaxiList.filter((item) =>
//     item.Routes.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const fetchTaxiAssignment = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:5000/taxiAssignment", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRouteTaxiList(res.data);
//     } catch (err) {
//       console.error("Failed to fetch taxi assignments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTaxiAssignment();
//     const interval = setInterval(fetchTaxiAssignment, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <div className="flex justify-end mb-4">
//         <Input
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           placeholder="Search Route"
//           className="pl-10 rounded-2xl w-[200px] h-11"
//           prefix={<CiSearch className="text-gray-400" />}
//         />
//       </div>

//       <Table columns={columns} dataSource={filteredData} rowKey="id" />

//       {modalRouteId && selectedRoute && (
//         <AssignTaxiModal
//           isModalOpen={true}
//           routeId={modalRouteId}
//           routeName={selectedRoute.Routes}
//           onClose={() => {
//             setModalRouteId(null);
//             setSelectedRoute(null);
//           }}
//           onAssigned={fetchTaxiAssignment}
//         />
//       )}
//     </>
//   );
// }


import { Button, Input, Table, Tag, Card, Badge, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { CiSearch, CiWarning } from "react-icons/ci";
import { TbRoute,TbUsers } from "react-icons/tb";
import { MdOutlineAssignment } from "react-icons/md";
import { FaExclamationTriangle } from "react-icons/fa";
import AssignTaxiModal from "../Components/modals/AssignTaxiModal";
import axios from "axios";
import type { ColumnsType } from 'antd/es/table';
import { LuCarTaxiFront } from "react-icons/lu";

type RouteTaxi = {
  id: number;
  Routes: string;
  Taxis: number;
  WaitingCount: number;
};

export default function TaxAssignment() {
  const [searchText, setSearchText] = useState("");
  const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
  const [modalRouteId, setModalRouteId] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteTaxi | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate demand status
  const getDemandStatus = (passengers: number, taxis: number) => {
    if (passengers > 50 && taxis < 3) {
      return { status: 'high', text: 'High Demand', color: 'error', icon: <FaExclamationTriangle /> };
    }
    return { status: 'normal', text: 'Normal', color: 'success', icon: null };
  };

  const columns: ColumnsType<RouteTaxi> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbRoute className="text-lg" />
          <span>ROUTE</span>
        </div>
      ),
      dataIndex: "Routes",
      key: "Routes",
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <LuCarTaxiFront className="text-lg" />
          <span>AVAILABLE TAXIS</span>
        </div>
      ),
      dataIndex: "Taxis",
      key: "Taxis",
      render: (taxis) => (
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${taxis < 3 ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center mr-2`}>
            <span className={`font-bold ${taxis < 3 ? 'text-red-600' : 'text-green-600'}`}>
              {taxis}
            </span>
          </div>
          <span className={taxis < 3 ? 'text-red-600 font-medium' : 'text-gray-700'}>
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
      dataIndex: "WaitingCount",
      key: "Passengers",
      render: (passengers) => (
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${passengers > 30 ? 'bg-orange-100' : 'bg-blue-100'} flex items-center justify-center mr-2`}>
            <span className={`font-bold ${passengers > 30 ? 'text-orange-600' : 'text-blue-600'}`}>
              {passengers}
            </span>
          </div>
          <span className={passengers > 30 ? 'text-orange-600 font-medium' : 'text-gray-700'}>
            {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiWarning className="text-lg" />
          <span>DEMAND STATUS</span>
        </div>
      ),
      key: "demandStatus",
      render: (_: any, record: RouteTaxi) => {
        const demand = getDemandStatus(record.WaitingCount, record.Taxis);
        return (
          <Tooltip title={demand.status === 'high' ? "High passenger demand with insufficient taxis" : "Normal operating conditions"}>
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
      key: "actions",
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
            className={demand.status === 'high' ? 'bg-gradient-to-r from-red-600 to-red-500 border-0' : 'bg-gradient-to-r from-blue-600 to-blue-500 border-0'}
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

  // Calculate stats for the header
  const highDemandRoutes = routeTaxiList.filter(item => 
    getDemandStatus(item.WaitingCount, item.Taxis).status === 'high'
  ).length;

  const fetchTaxiAssignment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/taxiAssignment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRouteTaxiList(res.data);
    } catch (err) {
      console.error("Failed to fetch taxi assignments:", err);
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
      <Card
        className="shadow-sm border-0 mb-6"
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by route name..."
              className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
              prefix={<CiSearch className="text-gray-400" />}
              allowClear
              style={{ minWidth: '250px' }}
            />
          </div>
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
                count={filteredData.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">
                Active Routes
              </span>
              {highDemandRoutes > 0 && (
                <Badge
                  count={highDemandRoutes}
                  color="red"
                  style={{ fontSize: '12px' }}
                  className="ml-2"
                />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {highDemandRoutes > 0 && (
                <span className="text-red-600 font-medium mr-4">
                  {highDemandRoutes} high demand routes
                </span>
              )}
              Auto-refreshes every 10 seconds
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} routes`,
            className: "px-4 md:px-6",
            responsive: true,
          }}
          scroll={{ x: true }}
          className="ant-table-striped"
          rowClassName={(record) => {
            const demand = getDemandStatus(record.WaitingCount, record.Taxis);
            return demand.status === 'high' ? 'bg-red-50/30' : '';
          }}
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

      {modalRouteId && selectedRoute && (
        <AssignTaxiModal
          isModalOpen={true}
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