// import {
//   Button,
//   Input,
//   Table,
//   Tag,
//   Card,
//   Space,
//   message,
//   Tooltip,
//   Badge,
// } from 'antd';
// import { useEffect, useState } from 'react';
// import CreateStationAdmin from '../Components/modals/CreateStationAdmin';
// import { CiSearch, CiMail, CiPhone } from 'react-icons/ci';
// import EditStationAdminModal from '../Components/modals/EditStationAdminModal';
// import { TbEdit, TbUser, TbBuildingEstate } from 'react-icons/tb';
// import { MdOutlineAdminPanelSettings } from 'react-icons/md';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import type { ColumnsType } from 'antd/es/table';

// type StationAdmin = {
//   id: number;
//   FullName: string;
//   Email: string;
//   PhoneNumber: string;
//   UserName: string;
//   Stations: string;
// };

// export default function Stations() {
//   const [IsCreateStationAdminOpen, setIsCreateStationAdminOpen] =
//     useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [EditingStationAdmin, setEditingStationAdmin] =
//     useState<StationAdmin | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [StationAdmin, setStationAdmin] = useState<StationAdmin[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const showCreateStationAdmin = () => {
//     setIsCreateStationAdminOpen(true);
//   };

//   const closeCreateStationAdmin = () => {
//     setIsCreateStationAdminOpen(false);
//   };

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//   };

//   const handleEdit = (stationadmin: StationAdmin) => {
//     setEditingStationAdmin(stationadmin);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingStationAdmin(null);
//   };

//   const handleStationUpdated = (updatedStation: StationAdmin) => {
//     setStationAdmin((prev) =>
//       prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
//     );
//     message.success('Station admin updated successfully');
//   };

//   const columns: ColumnsType<StationAdmin> = [
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbUser className="text-lg" />
//           <span>FULL NAME</span>
//         </div>
//       ),
//       dataIndex: 'FullName',
//       key: 'name',
//       responsive: ['md'],
//       render: (text) => <div className="font-medium text-gray-800">{text}</div>,
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <CiMail className="text-lg" />
//           <span>EMAIL</span>
//         </div>
//       ),
//       dataIndex: 'Email',
//       key: 'email',
//       responsive: ['md'],
//       render: (text) => (
//         <div className="flex items-center text-gray-600">
//           <CiMail className="mr-2 text-gray-400" />
//           {text}
//         </div>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <CiPhone className="text-lg" />
//           <span>PHONE</span>
//         </div>
//       ),
//       dataIndex: 'PhoneNumber',
//       key: 'phone',
//       responsive: ['md'],
//       render: (text) => (
//         <div className="flex items-center text-gray-600">
//           <CiPhone className="mr-2 text-gray-400" />0{text}
//         </div>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbUser className="text-lg" />
//           <span>USERNAME</span>
//         </div>
//       ),
//       dataIndex: 'UserName',
//       key: 'username',
//       responsive: ['md'],
//       render: (text) => (
//         <Tag color="default" className="font-mono">
//           @{text}
//         </Tag>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbBuildingEstate className="text-lg" />
//           <span>STATIONS</span>
//         </div>
//       ),
//       dataIndex: 'Stations',
//       key: 'stations',
//       responsive: ['md'],
//       render: (text) => (
//         <Tag color="green" className="text-xs">
//           {text}
//         </Tag>
//       ),
//     },
//     {
//       title: 'ACTIONS',
//       key: 'actions',
//       width: 120,
//       render: (_: any, record: StationAdmin) => (
//         <Space
//           size="small"
//           className="flex flex-col sm:flex-row gap-1"
//           onClick={(e) => {
//             e.stopPropagation();
//           }}
//         >
//           <Tooltip title="Edit admin">
//             <Button
//               type="text"
//               size="small"
//               icon={<TbEdit />}
//               onClick={() => handleEdit(record)}
//               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
//             />
//             {isEditModalOpen && EditingStationAdmin && (
//               <EditStationAdminModal
//                 isOpen={isEditModalOpen}
//                 handleCancel={closeEditModal}
//                 StationAdmin={EditingStationAdmin}
//                 onUpdated={handleStationUpdated}
//               />
//             )}
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   const filteredStationAdmins = StationAdmin.filter(
//     (stationAdmin) =>
//       stationAdmin.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
//       stationAdmin.Email.toLowerCase().includes(searchText.toLowerCase()) ||
//       stationAdmin.UserName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const fetchStationAdmins = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/stationAdmins', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStationAdmin(res.data);
//     } catch (err) {
//       console.error('Failed to fetch station admins:', err);
//       message.error('Failed to load station admins');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStationAdmins();
//   }, []);

//   const handleRowClick = (record: StationAdmin) => {
//     navigate(`/admin/StationAdmins/${record.id}`);
//   };

//   return (
//     <>
//       <Card
//         className="shadow-sm border-0 mb-4 md:mb-6"
//         bodyStyle={{ padding: '16px' }}
//       >
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
//           <Input
//             value={searchText}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search users..."
//             className="rounded-lg h-10 border-gray-300 focus:border-blue-500 w-full sm:flex-1 sm:max-w-sm md:max-w-md"
//             prefix={<CiSearch className="text-gray-400" />}
//             allowClear
//             size="middle"
//           />

//           <Button
//             type="primary"
//             onClick={showCreateStationAdmin}
//             icon={<MdOutlineAdminPanelSettings />}
//             className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 w-full sm:w-auto"
//             size="middle"
//           >
//             <span className="hidden sm:inline">Create Admin</span>
//             <span className="sm:hidden">+ New Admin</span>
//           </Button>
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
//                 count={filteredStationAdmins.length}
//                 showZero
//                 color="blue"
//                 style={{ fontSize: '12px' }}
//               />
//               <span className="text-gray-600 font-medium">Total Admins</span>
//             </div>
//             <div className="text-sm text-gray-500">
//               {filteredStationAdmins.length} of {StationAdmin.length} displayed
//             </div>
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredStationAdmins}
//           rowKey="id"
//           loading={loading}
//           onRow={(record) => ({
//             onClick: () => handleRowClick(record),
//             style: {
//               cursor: 'pointer',
//               transition: 'background-color 0.2s',
//             },
//             onMouseEnter: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = '#f8fafc';
//             },
//             onMouseLeave: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = '';
//             },
//           })}
//           pagination={{
//             showSizeChanger: true,
//             showQuickJumper: true,
//             className: 'px-4 md:px-6',
//             responsive: true,
//           }}
//           scroll={{ x: true }}
//           className="ant-table-striped"
//           rowClassName={(_, index) => (index % 2 === 0 ? 'bg-gray-50/50' : '')}
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

//       {IsCreateStationAdminOpen && (
//         <CreateStationAdmin
//           isModalOpen={IsCreateStationAdminOpen}
//           handleCancel={closeCreateStationAdmin}
//           onStationAdminCreated={fetchStationAdmins}
//         />
//       )}

//       {isEditModalOpen && EditingStationAdmin && (
//         <EditStationAdminModal
//           isOpen={isEditModalOpen}
//           handleCancel={closeEditModal}
//           StationAdmin={EditingStationAdmin}
//           onUpdated={handleStationUpdated}
//         />
//       )}
//     </>
//   );
// }
