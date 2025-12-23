// import { Button, Input, message, Table } from "antd";
// import { useEffect, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import EditDispachersModal from "../Components/modals/EditDispachers";
// import { TbEdit } from "react-icons/tb";
// import axios from "axios";
// import CreateDispachers from "../Components/modals/CreateDispachers";
// type Dispacher = {
//   id: number;
//   FullName: string;
//   Email: string;
//   PhoneNumber: number;
//    UserName: string;
//    Routes:string;
// };
// export default function Dispachers () {
//     const [IsCreateDispachersOpen, setIsCreateDispachersOpen] = useState(false);
//      const [searchText, setSearchText] = useState("");
//     const [EditingDispachers, setEditingDispachers] = useState<Dispacher | null>(null);

//      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//        const [dispacher , setDispacher ] = useState<Dispacher []>([]);
//   const showCreateDispacher = () => {
//    setIsCreateDispachersOpen(true);
//   };

//   const closeCreateDispacher = () => {
//      setIsCreateDispachersOpen(false);
//   };
//     const handleSearch = (value: string) => {
//     setSearchText(value);
  
//   };
//   const handleDelete = async (id: number) => {
//   if (!confirm("Are you sure you want to delete this dispacher?")) return;
//    if (!token) return;

//   try {
//     const res = await axios.delete(`http://localhost:5000/dispachers/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//      message.success(res.data.message || "Route deleted");
//       fetchDispachers(); // Refresh routes
//     } catch (err: any) {
//       console.error("Failed to delete route:", err.response?.data || err);
//       message.error(err.response?.data?.message || "Failed to delete route");
//     }
//   };

// const handleEdit = (dispacher: Dispacher) => {
//  setEditingDispachers(dispacher);
//   setIsEditModalOpen(true);
// };

// const closeEditModal = () => {
//   setIsEditModalOpen(false);
//     setEditingDispachers(null);
// };
// const handleDispacherUpdated = (updatedDispacher:Dispacher) => {
//   setDispacher((prev) =>
//     prev.map((d) => (d.id === updatedDispacher.id ? updatedDispacher : d))
//   );
// };
//    const columns = [
//     {
//       title: 'Full Name',
//        dataIndex: "FullName",
//       key: 'name',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'Email',
//       key: 'city',
//     },
//     {
//       title: 'Phone Number',
//       dataIndex: 'PhoneNumber',
//       key: 'location',
//     },
//     {
//      title: 'UserName',
//       dataIndex: 'UserName',
//       key: 'UserName',
//     },
//      {
//      title: 'Routes',
//         dataIndex: 'Routes',
//       key: 'routes',
//     },
//      {
//       title: 'Actions',
//       key: 'actions',
//        render: (_: any, record:Dispacher ) => (
//             <div className="flex gap-2">
//         <Button
//           type="primary"
//          onClick={() => handleEdit(record)}
//         >
//           <TbEdit />
        
//         </Button>
//           {isEditModalOpen && EditingDispachers && (
//     <EditDispachersModal
//       isOpen={isEditModalOpen}
//       handleCancel={closeEditModal}
//       Dispacher={EditingDispachers}
//       onUpdated={handleDispacherUpdated}
//     />
//   )}
//         <Button
//           type="primary"
//           danger
//           onClick={() => handleDelete(record.id)}
//         >
//           <RiDeleteBin6Line />
//         </Button>
//       </div>
          
//        )
//     },
//   ];
//  const filteredDispachers = dispacher.filter(
//     (dispacher) =>
//        dispacher.FullName.toLowerCase().includes(searchText.toLowerCase()) 
//      );

//       const token = localStorage.getItem("token");
//   if (!token) console.warn("No token found! Login required.");

//      const fetchDispachers = async () => {
//         try {
//            const res = await axios.get("http://localhost:5000/dispachers", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//           setDispacher(res.data);
//         } catch (err:any) {
//           console.error("Failed to fetch dispachers:", err);
//           message.error(err.response?.data?.message || "Failed to fetch routes");
//         }
//       };
//    useEffect(() => {
//      fetchDispachers  ();
//     }, []);
// return(
    
//     <>
//    <div className=" flex justify-end">
//           <Input
//             value={searchText}
//             onChange={(e) => handleSearch(e.target.value)}
//             placeholder="Search stations"
//             className="pl-10 rounded-2xl  w-[200px] h-11  mt-5"
//           prefix={<CiSearch className="text-gray-400" />}
//           />
//     <Button
//      className="mt-5 "
//     onClick={showCreateDispacher}
//     >Create New Dispachers
//     </Button>
//     {IsCreateDispachersOpen && <CreateDispachers isModalOpen={IsCreateDispachersOpen} handleCancel={closeCreateDispacher}  onDispachersCreated={fetchDispachers}/>}
//    </div>
//      <div>
//     <Table
//     columns={columns}
//      dataSource={filteredDispachers}
//       rowKey="id"
//     />
//    </div>
//     </>
// )
// }


// import { Button, Input, Table, Tag, Card, Space, Popconfirm, message, Tooltip, Badge } from "antd";
// import { useEffect, useState } from "react";
// import { CiSearch, CiMail, CiPhone, CiUser } from "react-icons/ci";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import EditDispachersModal from "../Components/modals/EditDispachers";
// import { TbEdit, TbUser, TbRoute } from "react-icons/tb";
// import { MdOutlinePersonAddAlt } from "react-icons/md";
// import axios from "axios";
// import CreateDispachers from "../Components/modals/CreateDispachers";
// import type { ColumnsType } from 'antd/es/table';
// import { useNavigate } from "react-router-dom";

// type Dispacher = {
//   id: number;
//   FullName: string;
//   Email: string;
//   PhoneNumber: number;
//   UserName: string;
//   Routes: string;
// };

// export default function Dispachers() {
//   const [IsCreateDispachersOpen, setIsCreateDispachersOpen] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [EditingDispachers, setEditingDispachers] = useState<Dispacher | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [dispacher, setDispacher] = useState<Dispacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); 
//   const token = localStorage.getItem("token");
//   if (!token) console.warn("No token found! Login required.");

//   const showCreateDispacher = () => {
//     setIsCreateDispachersOpen(true);
//   };

//   const closeCreateDispacher = () => {
//     setIsCreateDispachersOpen(false);
//   };

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const res = await axios.delete(`http://localhost:5000/dispachers/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       message.success(res.data.message || "Dispatcher deleted successfully");
//       fetchDispachers();
//     } catch (err: any) {
//       console.error("Failed to delete dispatcher:", err.response?.data || err);
//       message.error(err.response?.data?.message || "Failed to delete dispatcher");
//     }
//   };

//   const handleEdit = (dispacher: Dispacher) => {
//     setEditingDispachers(dispacher);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingDispachers(null);
//   };

//   const handleDispacherUpdated = (updatedDispacher: Dispacher) => {
//     setDispacher((prev) =>
//       prev.map((d) => (d.id === updatedDispacher.id ? updatedDispacher : d))
//     );
//     message.success("Dispatcher updated successfully");
//   };

//   const columns: ColumnsType<Dispacher> = [
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbUser className="text-lg" />
//           <span>FULL NAME</span>
//         </div>
//       ),
//       dataIndex: "FullName",
//       key: 'name',
//       responsive: ['md'],
//       render: (text) => (
//         <div className="font-medium text-gray-800">{text}</div>
//       ),
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
//           <span className="truncate">{text}</span>
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
//           <CiPhone className="mr-2 text-gray-400" />
//           <span>+{text}</span>
//         </div>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <CiUser className="text-lg" />
//           <span>USERNAME</span>
//         </div>
//       ),
//       dataIndex: 'UserName',
//       key: 'username',
//       responsive: ['md'],
//       render: (text) => (
//         <Tag color="blue" className="font-mono">
//           @{text}
//         </Tag>
//       ),
//     },
//     {
//       title: (
//         <div className="flex items-center space-x-2">
//           <TbRoute className="text-lg" />
//           <span>ASSIGNED ROUTES</span>
//         </div>
//       ),
//       dataIndex: 'Routes',
//       key: 'routes',
//       responsive: ['md'],
//       render: (routes) => {
//         const routeArray = routes?.split(',') || [];
//         return (
//           <div className="flex flex-wrap gap-1">
//             {routeArray.slice(0, 2).map((route: string, index: number) => (
//               <Tag key={index} color="green" className="text-xs">
//                 {route.trim()}
//               </Tag>
//             ))}
//             {routeArray.length > 2 && (
//               <Tooltip title={routeArray.slice(2).join(', ')}>
//                 <Tag color="default" className="text-xs">
//                   +{routeArray.length - 2} more
//                 </Tag>
//               </Tooltip>
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       title: 'ACTIONS',
//       key: 'actions',
//       width: 120,
//       render: (_: any, record: Dispacher) => (
//         <Space 
//           size="small" 
//           className="flex flex-col sm:flex-row gap-1"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <Tooltip title="Edit dispatcher">
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
//             title="Delete Dispatcher"
//             description="Are you sure you want to delete this dispatcher?"
//             onConfirm={(e) => {
//               if (e) e.stopPropagation();
//               handleDelete(record.id);
//             }}
//             okText="Yes"
//             cancelText="No"
//             okType="danger"
//             onPopupClick={(e) => e.stopPropagation()}
//           >
//             <Tooltip title="Delete dispatcher">
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
//         </Space>
//       ),
//     },
//   ];

//   const filteredDispachers = dispacher.filter(
//     (dispacher) =>
//       dispacher.FullName.toLowerCase().includes(searchText.toLowerCase()) ||
//       dispacher.Email.toLowerCase().includes(searchText.toLowerCase()) ||
//       dispacher.UserName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const fetchDispachers = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/dispachers", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDispacher(res.data);
//     } catch (err: any) {
//       console.error("Failed to fetch dispatchers:", err);
//       message.error(err.response?.data?.message || "Failed to fetch dispatchers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDispachers();
//   }, []);

//  const handleRowClick = (record: Dispacher) => {
//     navigate(`/stationAdmin/Dispachers/${record.id}`);
//   };

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
//               placeholder="Search by name, email, or username..."
//               className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
//               prefix={<CiSearch className="text-gray-400" />}
//               allowClear
//               style={{ minWidth: '250px' }}
//             />
            
//             <Button
//               type="primary"
//               onClick={showCreateDispacher}
//               icon={<MdOutlinePersonAddAlt />}
//               className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 ml-150"
//               size="middle"
//             >
//               <span className="hidden sm:inline">Create Dispatcher</span>
              
//             </Button>
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
//                 count={filteredDispachers.length}
//                 showZero
//                 color="blue"
//                 style={{ fontSize: '12px' }}
//               />
//               <span className="text-gray-600 font-medium">
//                 Total Dispatchers
//               </span>
//             </div>
//             <div className="text-sm text-gray-500">
//               {filteredDispachers.length} of {dispacher.length} displayed
//             </div>
//           </div>
//         </div>

//         <Table
//           columns={columns}
//           dataSource={filteredDispachers}
//           rowKey="id"
//           loading={loading}
//           onRow={(record) => ({
//             onClick: () => handleRowClick(record),
//             style: { 
//               cursor: 'pointer',
//               transition: 'background-color 0.2s'
//             },
//             onMouseEnter: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = '#f8fafc';
//             },
//             onMouseLeave: (event: React.MouseEvent) => {
//               const row = event.currentTarget as HTMLElement;
//               row.style.backgroundColor = '';
//             }
//           })}
//           pagination={{
//             showSizeChanger: true,
//             showQuickJumper: true,
//             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} dispatchers`,
//             className: "px-4 md:px-6",
//             responsive: true,
//           }}
//           scroll={{ x: true }}
//           className="ant-table-striped"
//           rowClassName={(_, index) => index % 2 === 0 ? 'bg-gray-50/50' : ''}
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
//       {IsCreateDispachersOpen && (
//         <CreateDispachers
//           isModalOpen={IsCreateDispachersOpen}
//           handleCancel={closeCreateDispacher}
//           onDispachersCreated={fetchDispachers}
//         />
//       )}

//       {isEditModalOpen && EditingDispachers && (
//         <EditDispachersModal
//           isOpen={isEditModalOpen}
//           handleCancel={closeEditModal}
//           Dispacher={EditingDispachers}
//           onUpdated={handleDispacherUpdated}
//         />
//       )}
//     </>
//   );
// }


import { Button, Input, Table, Tag, Card, Space, Popconfirm, message, Tooltip, Badge } from "antd";
import { useEffect, useState } from "react";
import { CiSearch, CiMail, CiPhone, CiUser } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditDispachersModal from "../Components/modals/EditDispachers";
import { TbEdit, TbUser, TbRoute } from "react-icons/tb";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import axios from "axios";
import CreateDispachers from "../Components/modals/CreateDispachers";
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from "react-router-dom";

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
  const [searchText, setSearchText] = useState("");
  const [EditingDispachers, setEditingDispachers] = useState<Dispatcher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.warn("No token found! Login required.");
    message.warning("Authentication required");
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

  const handleDelete = async (id: number) => {
    if (!token) {
      message.error("Authentication required");
      return;
    }
    
    try {
      const res = await axios.delete(`http://localhost:5000/dispachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success(res.data.message || "Dispatcher deleted successfully");
      fetchDispatchers();
    } catch (err: any) {
      console.error("Failed to delete dispatcher:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to delete dispatcher");
    }
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
    message.success("Dispatcher updated successfully");
  };

  const columns: ColumnsType<Dispatcher> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TbUser className="text-lg" />
          <span>FULL NAME</span>
        </div>
      ),
      dataIndex: "FullName",
      key: 'name',
      responsive: ['md'],
      render: (text) => (
        <div className="font-medium text-gray-800">{text}</div>
      ),
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
        // Format phone number for display
        const phoneStr = String(text);
        const formatted = phoneStr.startsWith('09') ? phoneStr : 
                         phoneStr.startsWith('+2519') ? phoneStr : 
                         phoneStr.startsWith('2519') ? `+${phoneStr}` : 
                         phoneStr.startsWith('9') && phoneStr.length === 9 ? `0${phoneStr}` : phoneStr;
        
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
        
        // Split by comma for multiple routes
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
          {/* <Popconfirm
            title="Delete Dispatcher"
            description="Are you sure you want to delete this dispatcher?"
            onConfirm={(e) => {
              if (e) e.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
            okType="danger"
            onPopupClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Delete dispatcher">
              <Button
                type="text"
                size="small"
                danger
                icon={<RiDeleteBin6Line />}
                className="hover:bg-red-50"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm> */}
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
      message.error("Please login again");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/dispachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Ensure PhoneNumber is string
      const mappedDispatchers = res.data.map((dispatcher: any) => ({
        ...dispatcher,
        PhoneNumber: String(dispatcher.PhoneNumber || '')
      }));
      
      setDispatchers(mappedDispatchers);
    } catch (err: any) {
      console.error("Failed to fetch dispatchers:", err);
      message.error(err.response?.data?.message || "Failed to fetch dispatchers");
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
        className="shadow-sm border-0 mb-6"
        bodyStyle={{ padding: '20px' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, email, or username..."
              className="rounded-lg h-10 border-gray-300 focus:border-blue-500"
              prefix={<CiSearch className="text-gray-400" />}
              allowClear
              style={{ minWidth: '250px' }}
            />
            
            <Button
              type="primary"
              onClick={showCreateDispatcher}
              icon={<MdOutlinePersonAddAlt />}
              className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 hover:from-blue-700 hover:to-blue-600 shadow-sm h-10 ml-150"
              size="middle"
            >
              <span className="hidden sm:inline">Create Dispatcher</span>
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} dispatchers`,
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