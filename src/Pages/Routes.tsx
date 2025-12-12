
// import { Button, Input, Table, message } from "antd";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { CiSearch } from "react-icons/ci";
// import { TbEdit } from "react-icons/tb";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import EditRoutesModal from "../Components/modals/EditRoutesModal";
// import CreateRoutes from "../Components/modals/CreateRoutes";

// type Route = {
//   id: number;
//   StartTerminal: string;
//   EndTerminal: string;
// };

// export default function Routess() {
//   const [routes, setRoutes] = useState<Route[]>([]);
//   const [searchText, setSearchText] = useState("");
//   const [IsCreateRoutesOpen, setIsCreateRoutesOpen] = useState(false);
//   const [editingRoute, setEditingRoute] = useState<Route | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const token = localStorage.getItem("token");
//   if (!token) console.warn("No token found! Login required.");

//   // Fetch routes
//   const fetchRoutes = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get("http://localhost:5000/routes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Fetched routes:", res.data);
//       setRoutes(res.data);
//     } catch (err: any) {
//       console.error("Failed to fetch routes:", err.response?.data || err);
//       message.error(err.response?.data?.message || "Failed to fetch routes");
//     }
//   };

//   useEffect(() => {
//     fetchRoutes();
//   }, []);

//   // Delete route
//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this route?")) return;
//     if (!token) return;

//     try {
//       const res = await axios.delete(`http://localhost:5000/routes/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       message.success(res.data.message || "Route deleted");
//       fetchRoutes(); // Refresh routes
//     } catch (err: any) {
//       console.error("Failed to delete route:", err.response?.data || err);
//       message.error(err.response?.data?.message || "Failed to delete route");
//     }
//   };

//   // Edit route
//   const handleEdit = (route: Route) => {
//     setEditingRoute(route);
//     setIsEditModalOpen(true);
//   };
//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingRoute(null);
//   };
//   const handleRouteUpdated = () => fetchRoutes();

//   const filteredRoutes = routes.filter(
//     (route) =>
//       route.StartTerminal.toLowerCase().includes(searchText.toLowerCase()) ||
//       route.EndTerminal.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const showCreateRoutes = () => setIsCreateRoutesOpen(true);
//   const closeCreateRoutes = () => setIsCreateRoutesOpen(false);

//   const columns = [
//     { title: "Start Terminal", dataIndex: "StartTerminal", key: "StartTerminal" },
//     { title: "End Terminal", dataIndex: "EndTerminal", key: "EndTerminal" },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: Route) => (
//         <div className="flex gap-2">
//           <Button type="primary" onClick={() => handleEdit(record)}>
//             <TbEdit />
//           </Button>
//           {isEditModalOpen && editingRoute && (
//             <EditRoutesModal
//               isOpen={isEditModalOpen}
//               handleCancel={closeEditModal}
//               route={editingRoute}
//               onUpdated={handleRouteUpdated}
//             />
//           )}
//           <Button type="primary" danger onClick={() => handleDelete(record.id)}>
//             <RiDeleteBin6Line />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="flex justify-end gap-2 mt-5">
//         <Input
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           placeholder="Search stations"
//           className="pl-10 rounded-2xl w-[200px] h-11"
//           prefix={<CiSearch className="text-gray-400" />}
//         />
//         <Button onClick={showCreateRoutes}>Create New Route</Button>
//         {IsCreateRoutesOpen && (
//           <CreateRoutes
//             isModalOpen={IsCreateRoutesOpen}
//             handleCancel={closeCreateRoutes}
//             onRoutesCreated={fetchRoutes}
//           />
//         )}
//       </div>

//       <div className="mt-5">
//         <Table columns={columns} dataSource={filteredRoutes} rowKey="id" />
//       </div>
//     </>
//   );
// }

import { Button, Input, Table, Tag, Card, Space, Popconfirm, message, Tooltip, Badge } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch, CiLocationArrow1, CiRoute } from "react-icons/ci";
import { TbEdit, TbRoute } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddRoad } from "react-icons/md";
import EditRoutesModal from "../Components/modals/EditRoutesModal";
import CreateRoutes from "../Components/modals/CreateRoutes";
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";

type Route = {
  id: number;
  StartTerminal: string;
  EndTerminal: string;
};

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchText, setSearchText] = useState("");
  const [IsCreateRoutesOpen, setIsCreateRoutesOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const  navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) console.warn("No token found! Login required.");

  // Fetch routes
  const fetchRoutes = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched routes:", res.data);
      setRoutes(res.data);
    } catch (err: any) {
      console.error("Failed to fetch routes:", err.res?.data || err);
      message.error(err.res?.data?.message || "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Delete route
  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:5000/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success(res.data.message || "Route deleted successfully");
      fetchRoutes(); // Refresh routes
    } catch (err: any) {
      console.error("Failed to delete route:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to delete route");
    }
  };

  // Edit route
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
      route.StartTerminal.toLowerCase().includes(searchText.toLowerCase()) ||
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
      dataIndex: "StartTerminal",
      key: "StartTerminal",
      responsive: ['md'],
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiLocationArrow1 className="text-lg text-red-500" />
          <span>END TERMINAL</span>
        </div>
      ),
      dataIndex: "EndTerminal",
      key: "EndTerminal",
      responsive: ['md'],
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiRoute className="text-lg text-blue-500" />
          <span>ROUTE</span>
        </div>
      ),
      key: "routePath",
      responsive: ['md'],
      render: (_, record) => (
        <div className="flex items-center text-gray-600">
          <span className="font-medium">{record.StartTerminal}</span>
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
              icon={<TbEdit />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Route"
            description="Are you sure you want to delete this route?"
            onConfirm={(e) => {
              if (e) e.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
            okType="danger"
            onPopupClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Delete route">
              <Button
                type="text"
                size="small"
                danger
                icon={<RiDeleteBin6Line />}
                className="hover:bg-red-50"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
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
        className="shadow-sm border-0 mb-6"
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by start or end terminal..."
              className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
              prefix={<CiSearch className="text-gray-400" />}
              allowClear
              style={{ minWidth: '250px' }}
            />
            
            <Button
              type="primary"
              onClick={showCreateRoutes}
              icon={<MdOutlineAddRoad />}
              className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 ml-150"
              size="middle"
            >
              <span className="hidden sm:inline ">Create Route</span>
             
            </Button>
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
                count={filteredRoutes.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">
                Total Routes
              </span>
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
      transition: 'background-color 0.2s'
    },
    onMouseEnter: (event: React.MouseEvent) => {
      const row = event.currentTarget as HTMLElement;
      row.style.backgroundColor = '#f8fafc';
    },
    onMouseLeave: (event: React.MouseEvent) => {
      const row = event.currentTarget as HTMLElement;
      row.style.backgroundColor = '';
    }
  })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} routes`,
            className: "px-4 md:px-6",
            responsive: true,
          }}
          scroll={{ x: true }}
          className="ant-table-striped"
          rowClassName={(_, index) => index % 2 === 0 ? 'bg-gray-50/50' : ''}
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

      {/* Modals */}
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