// import { Button, Input, Table, Tag, Card, Space, Popconfirm, message, Tooltip, Badge } from "antd";
// import { useEffect, useState } from "react";
// import CreateStations from "../Components/modals/CreateStations";
// import axios from "axios";
// import { CiSearch, CiLocationOn} from "react-icons/ci";
// import { PiCityLight } from "react-icons/pi";
// import { TbEdit, TbBusStop } from "react-icons/tb";
// import EditStationModal from "../Components/modals/EditStationsModal";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { MdOutlineAddLocation } from "react-icons/md";
// import type { ColumnsType } from 'antd/es/table';
// import { useNavigate } from "react-router-dom";

// type Station = {
//   id: number;
//   StationName: string;
//   City: string;
//   location: string;
//  status: 'active' | 'inactive'; 
// };

// export default function Stations() {
//   const [IsCreateStationOpen, setIsCreateStationOpen] = useState(false);
//   const [stations, setStations] = useState<Station[]>([]);
//   const [searchText, setSearchText] = useState("");
//   const [editingStation, setEditingStation] = useState<Station | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//  const navigate = useNavigate();
//   const showCreateStation = () => {
//     setIsCreateStationOpen(true);
//   };

//   const closeCreateStation = () => {
//     setIsCreateStationOpen(false);
//   };

//   const handleEdit = (station: Station) => {
//     setEditingStation(station);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingStation(null);
//   };

//   const handleStationUpdated = (updatedStation: Station) => {
//     setStations((prev) =>
//       prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
//     );
//     message.success("Station updated successfully");
//   };

//   const filteredStations = stations.filter(
//     (station) =>
//       station.StationName.toLowerCase().includes(searchText.toLowerCase()) ||
//       station.City.toLowerCase().includes(searchText.toLowerCase()) ||
//       station.location.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const fetchStations = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/stations");
//         const stationsWithStatus = res.data.map((station: any) => ({
//         ...station,
//         status: station.status || 'active' // Default to active if status not provided
//       }));
//       setStations(res.data);
//     } catch (err) {
//       console.error("Failed to fetch stations:", err);
//       message.error("Failed to load stations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStations();
//   }, []);

// const handleStatusChange = async (id: number, currentStatus: 'active' | 'inactive') => {
//     try {
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
//       // Send update to backend
//       await axios.put(`http://localhost:5000/stations/${id}/status`, { 
//         status: newStatus 
//       });
      
//       // Update local state
//       setStations((prev) =>
//         prev.map((s) => 
//           s.id === id ? { ...s, status: newStatus } : s
//         )
//       );
      
//       message.success(`Station ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to update station status");
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await axios.delete(`http://localhost:5000/stations/${id}`);
//       setStations((prev) => prev.filter((s) => s.id !== id));
//       message.success("Station deleted successfully");
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to delete station");
//     }
//   };

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//   };

//   const columns: ColumnsType<Station> = [
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbBusStop className="text-lg" />
//           <span>STATION NAME</span>
//         </div>
//       ),
//       dataIndex: "StationName",
//       key: 'name',
//       responsive: ['md'],
//       render: (text) => (
//         <div className="font-medium text-gray-800">{text}</div>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <PiCityLight  className="text-lg" />
//           <span>CITY</span>
//         </div>
//       ),
//       dataIndex: 'City',
//       key: 'city',
//       responsive: ['md'],
//       render: (text) => (
//         <div className="flex items-center text-gray-600">
//           <PiCityLight  className="mr-2 text-gray-400" />
//           {text}
//         </div>
//       ),
//     },
    
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <CiLocationOn className="text-lg" />
//           <span>LOCATION</span>
//         </div>
//       ),
//       dataIndex: 'location',
//       key: 'location',
//       responsive: ['md'],
//       render: (text) => (
//         <Tag color="blue" className="text-xs">
//           {text}
//         </Tag>
//       ),
//     },
//      {
//       title: 'STATUS',
//       key: 'status',
//       responsive: ['md'],
//       render: (_, record) => (
//         <div className="flex items-center">
//           <Switch
//             checked={record.status === 'active'}
//             onChange={(checked) => handleStatusChange(record.id, record.status)}
//             size="small"
//             checkedChildren="Active"
//             unCheckedChildren="Inactive"
//             className={record.status === 'active' ? 'bg-green-500' : ''}
//           />
//           <Tag 
//             color={record.status === 'active' ? 'success' : 'default'} 
//             className="ml-2 text-xs"
//           >
//             {record.status.toUpperCase()}
//           </Tag>
//         </div>
//       ),
//     },
//     {
//       title: 'ACTIONS',
//       key: 'actions',
//       width: 120,
//       render: (_: any, record: Station) => (
//         <Space 
//           size="small" 
//           className="flex flex-col sm:flex-row gap-1"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <Tooltip title="Edit station">
//             <Button
//               type="text"
//               size="small"
//               icon={<TbEdit />}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEdit(record);
//               }}
//               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
//             />
//           </Tooltip>
//           <Popconfirm
//             title="Delete Station"
//             description="Are you sure you want to delete this station?"
//             onConfirm={(e) => {
//               if (e) e.stopPropagation();
//               handleDelete(record.id);
//             }}
//             okText="Yes"
//             cancelText="No"
//             okType="danger"
//             onPopupClick={(e) => e.stopPropagation()}
//           >
//             <Tooltip title="Delete station">
//               <Button
//                 type="text"
//                 size="small"
//                 danger
//                 icon={<RiDeleteBin6Line />}
//                 className="hover:bg-red-50"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </Tooltip>
//           </Popconfirm>
//            <Popconfirm
//             title={`${record.status === 'active' ? 'Deactivate' : 'Activate'} Station`}
//             description={`Are you sure you want to ${record.status === 'active' ? 'deactivate' : 'activate'} this station?`}
//             onConfirm={(e) => {
//               if (e) e.stopPropagation();
//               handleDelete(record.id);
//             }}
//             okText={`Yes, ${record.status === 'active' ? 'Deactivate' : 'Activate'}`}
//             cancelText="No"
//             okType={record.status === 'active' ? 'danger' : 'primary'}
//             onPopupClick={(e) => e.stopPropagation()}
//           >
//             <Tooltip title={record.status === 'active' ? "Deactivate station" : "Activate station"}>
//               <Button
//                 type="text"
//                 size="small"
//                 danger={record.status === 'active'}
//                 icon={<RiDeleteBin6Line />}
//                 className={`hover:bg-${
//                   record.status === 'active' ? 'red' : 'green'
//                 }-50`}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </Tooltip>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   const handleRowClick = (record: Station) => {
//     navigate(`/admin/Stations/${record.id}`);
//   };

//    const activeStations = stations.filter(s => s.status === 'active').length;
//   const inactiveStations = stations.filter(s => s.status === 'inactive').length;

//   return (
//     <>
//       <Card
//         className="shadow-sm border-0 mb-6"
//         bodyStyle={{ padding: '20px' }}
//       >
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             <Input
//               value={searchText}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Search by station name, city, or location..."
//               className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
//               prefix={<CiSearch className="text-gray-400" />}
//               allowClear
//               style={{ minWidth: '250px' }}
//             />
            
//             <Button
//               type="primary"
//               onClick={showCreateStation}
//               icon={<MdOutlineAddLocation />}
//               className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 ml-150"
//               size="middle"
//             >
//               <span className="hidden sm:inline">Create Station</span>
//             </Button>
//           </div>
//         </div>
//       </Card>

//        <Card
//         className="shadow-sm border-0 mb-6"
//         bodyStyle={{ padding: '16px' }}
//       >
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <Badge
//               count={stations.length}
//               showZero
//               color="blue"
//               style={{ fontSize: '14px' }}
//             />
//             <span className="text-gray-700 font-medium">Total Stations</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Badge
//               count={activeStations}
//               showZero
//               color="green"
//               style={{ fontSize: '14px' }}
//             />
//             <span className="text-gray-700 font-medium">Active Stations</span>
//           </div>
//           <div className="flex items-center gap-3">
//             <Badge
//               count={inactiveStations}
//               showZero
//               color="default"
//               style={{ fontSize: '14px' }}
//             />
//             <span className="text-gray-700 font-medium">Inactive Stations</span>
//           </div>
//         </div>
//       </Card>
    
//       <Card
//         className="shadow-sm border-0 overflow-hidden"
//         bodyStyle={{ padding: 0 }}
//       >
//         <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//             <div className="flex items-center gap-2">
//               <Badge
//                 count={filteredStations.length}
//                 showZero
//                 color="blue"
//                 style={{ fontSize: '12px' }}
//               />
//               <span className="text-gray-600 font-medium">
//                 Displayed Stations
//               </span>
//             </div>
//             <div className="text-sm text-gray-500">
//               {filteredStations.length} of {stations.length} stations • 
//               <span className="text-green-600 ml-1"> {activeStations} Active</span> • 
//               <span className="text-gray-500 ml-1"> {inactiveStations} Inactive</span>
//             </div>
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredStations}
//           rowKey="id"
//           loading={loading}
//           onRow={(record) => ({
//             onClick: () => handleRowClick(record),
//             style: { 
//               cursor: 'pointer',
//               transition: 'background-color 0.2s',
//               backgroundColor: record.status === 'inactive' ? '#fafafa' : 'white'
//             },
//             onMouseEnter: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = '#f8fafc';
//             },
//             onMouseLeave: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = record.status === 'inactive' ? '#fafafa' : 'white';
//             }
//           })}
//           pagination={{
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stations`,
//             className: "px-4 md:px-6",
//             responsive: true,
//           }}
//           scroll={{ x: true }}
//           className="ant-table-striped"
//           rowClassName={(record, index) => 
//             index % 2 === 0 
//               ? record.status === 'inactive' ? 'bg-gray-50/30' : 'bg-gray-50/50' 
//               : ''
//           }
//           style={{
//             backgroundColor: 'transparent',
//           }}
//           components={{
//             body: {
//               cell: (props: any) => (
//                 <td {...props} className="border-b border-gray-100" />
//               ),
//             },
//           }}
//         />
//       </Card>
//       {/* Modals */}
//       {IsCreateStationOpen && (
//         <CreateStations
//           isModalOpen={IsCreateStationOpen}
//           handleCancel={closeCreateStation}
//           onStationCreated={fetchStations}
//         />
//       )}

//       {isEditModalOpen && editingStation && (
//         <EditStationModal
//           isOpen={isEditModalOpen}
//           handleCancel={closeEditModal}
//           station={editingStation}
//           onUpdated={handleStationUpdated}
//         />
//       )}
//     </>
//   );
// }

import { Button, Input, Table, Tag, Card, Space, Popconfirm, message, Tooltip, Badge, Switch } from "antd";
import { useEffect, useState } from "react";
import CreateStations from "../Components/modals/CreateStations";
import axios from "axios";
import { CiSearch, CiLocationOn} from "react-icons/ci";
import { PiCityLight } from "react-icons/pi";
import { TbEdit, TbBusStop } from "react-icons/tb";
import EditStationModal from "../Components/modals/EditStationsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddLocation } from "react-icons/md";
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";

type Station = {
  id: number;
  StationName: string;
  City: string;
  location: string;
  status: 'active' | 'inactive'; // Add status field
};

export default function Stations() {
  const [IsCreateStationOpen, setIsCreateStationOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [searchText, setSearchText] = useState("");
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const showCreateStation = () => {
    setIsCreateStationOpen(true);
  };

  const closeCreateStation = () => {
    setIsCreateStationOpen(false);
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingStation(null);
  };

  const handleStationUpdated = (updatedStation: Station) => {
    setStations((prev) =>
      prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
    );
    message.success("Station updated successfully");
  };

  const filteredStations = stations.filter(
    (station) =>
      station.StationName.toLowerCase().includes(searchText.toLowerCase()) ||
      station.City.toLowerCase().includes(searchText.toLowerCase()) ||
      station.location.toLowerCase().includes(searchText.toLowerCase()) ||
      station.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchStations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/stations");
      // Add default status if not present (for backward compatibility)
      const stationsWithStatus = res.data.map((station: any) => ({
        ...station,
        status: station.status || 'active' // Default to active if status not provided
      }));
      setStations(stationsWithStatus);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      message.error("Failed to load stations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
  try {
    // Send update to backend
    await axios.put(`http://localhost:5000/stations/${id}/status`, { 
      status: newStatus 
    });
    
    // Update local state
    setStations((prev) =>
      prev.map((s) => 
        s.id === id ? { ...s, status: newStatus } : s
      )
    );
    
    message.success(`Station ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  } catch (err) {
    console.error(err);
    message.error("Failed to update station status");
  }
};

  const handleDelete = async (id: number) => {
    try {
      // Instead of deleting, change status to inactive
      await handleStatusChange(id, 'active');
    } catch (err) {
      console.error(err);
      message.error("Failed to update station status");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns: ColumnsType<Station> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbBusStop className="text-lg" />
          <span>STATION NAME</span>
        </div>
      ),
      dataIndex: "StationName",
      key: 'name',
      responsive: ['md'],
      render: (text, record) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            record.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <div className="font-medium text-gray-800">{text}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <PiCityLight  className="text-lg" />
          <span>CITY</span>
        </div>
      ),
      dataIndex: 'City',
      key: 'city',
      responsive: ['md'],
      render: (text) => (
        <div className="flex items-center text-gray-600">
          <PiCityLight  className="mr-2 text-gray-400" />
          {text}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CiLocationOn className="text-lg" />
          <span>LOCATION</span>
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      responsive: ['md'],
      render: (text) => (
        <Tag color="blue" className="text-xs">
          {text}
        </Tag>
      ),
    },
    {
      title: 'STATUS',
      key: 'status',
      responsive: ['md'],
      render: (_, record) => (
        <div className="flex items-center">
         
          <Tag 
            color={record.status === 'active' ? 'success' : 'default'} 
            className="ml-2 text-xs"
          >
            {record.status.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_: any, record: Station) => (
        <Space 
          size="small" 
          className="flex flex-col sm:flex-row gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit station">
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
          <Tooltip title={record.status === 'active' ? "Click to deactivate" : "Click to activate"}>
  <Switch
    checked={record.status === 'active'}
    onChange={(checked) => {
      // 'checked' is the NEW value (true for active, false for inactive)
      const newStatus = checked ? 'active' : 'inactive';
      handleStatusChange(record.id, newStatus);
    }}
    size="small"
    checkedChildren="A"
    unCheckedChildren="I"
    style={{
      backgroundColor: record.status === 'active' ? '#52c41a' : '#d9d9d9'
    }}
  />
</Tooltip>
        </Space>
      ),
    },
  ];

  const handleRowClick = (record: Station) => {
    navigate(`/admin/Stations/${record.id}`);
  };

  // Statistics for the header
  const activeStations = stations.filter(s => s.status === 'active').length;
  const inactiveStations = stations.filter(s => s.status === 'inactive').length;

  return (
    <>
      <Card
        className="shadow-sm border-0 mb-6"
        bodyStyle={{ padding: '20px' }}
      >
       <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 ">
  <Input
    value={searchText}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Search by station name, city, location or status..."
    className="rounded-lg h-10 border-gray-300 focus:border-blue-500 w-40 "
    prefix={<CiSearch className="text-gray-400" />}
    allowClear
  />
  
  <Button
    type="primary"
    onClick={showCreateStation}
    icon={<MdOutlineAddLocation />}
    className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 w-full sm:w-auto"
    size="middle"
  >
    <span className="text-sm sm:text-base">Create Station</span>
  </Button>
</div>
      </Card>

      <Card
        className="shadow-sm border-0 mb-6"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Badge
              count={stations.length}
              showZero
              color="blue"
              style={{ fontSize: '14px' }}
            />
            <span className="text-gray-700 font-medium">Total Stations</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              count={activeStations}
              showZero
              color="green"
              style={{ fontSize: '14px' }}
            />
            <span className="text-gray-700 font-medium">Active Stations</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              count={inactiveStations}
              showZero
              color="default"
              style={{ fontSize: '14px' }}
            />
            <span className="text-gray-700 font-medium">Inactive Stations</span>
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
                count={filteredStations.length}
                showZero
                color="blue"
                style={{ fontSize: '12px' }}
              />
              <span className="text-gray-600 font-medium">
                Displayed Stations
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredStations.length} of {stations.length} stations • 
              <span className="text-green-600 ml-1"> {activeStations} Active</span> • 
              <span className="text-gray-500 ml-1"> {inactiveStations} Inactive</span>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredStations}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { 
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              backgroundColor: record.status === 'inactive' ? '#fafafa' : 'white'
            },
            onMouseEnter: (event: React.MouseEvent) => {
              const row = event.currentTarget as HTMLElement;
              row.style.backgroundColor = '#f8fafc';
            },
            onMouseLeave: (event: React.MouseEvent) => {
              const row = event.currentTarget as HTMLElement;
              row.style.backgroundColor = record.status === 'inactive' ? '#fafafa' : 'white';
            }
          })}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            className: "px-4 md:px-6",
            responsive: true,
          }}
          scroll={{ x: true }}
          className="ant-table-striped"
          rowClassName={(record, index) => 
            index % 2 === 0 
              ? record.status === 'inactive' ? 'bg-gray-50/30' : 'bg-gray-50/50' 
              : ''
          }
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
      {IsCreateStationOpen && (
        <CreateStations
          isModalOpen={IsCreateStationOpen}
          handleCancel={closeCreateStation}
          onStationCreated={fetchStations}
        />
      )}

      {isEditModalOpen && editingStation && (
        <EditStationModal
          isOpen={isEditModalOpen}
          handleCancel={closeEditModal}
          station={editingStation}
          onUpdated={handleStationUpdated}
        />
      )}
    </>
  );
}