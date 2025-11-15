import { Button, Input, Table } from "antd";
import { useEffect, useState } from "react";

import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
// import EditStationModal from "../Components/modals/EditStationsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import CreateRoutes from "../Components/modals/CreateRoutes";
type Route = {
  id: number;
  StartTerminal: string;
  EndTerminal: string;

};
export default function Routes () {
    const [IsCreateRoutesOpen, setIsCreateRoutesOpen] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
      const [searchText, setSearchText] = useState("");
//       const [editingRoute, setEditingRoute] = useState<Route | null>(null);
// const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// const handleEdit = (route: Route) => {
//  setEditingRoute(route);
//   setIsEditModalOpen(true);
// };

// const closeEditModal = () => {
//   setIsEditModalOpen(false);
//  setEditingRoute(null);
// };
// const handleRuoteUpdated = (updatedRoute: Route) => {
//   setRoutes((prev) =>
//     prev.map((s) => (s.id === updatedRoute.id ? updatedRoute : s))
//   );
// };
  const showCreateRoutes = () => {
   setIsCreateRoutesOpen(true);
  };

  const closeCreateRoutes = () => {
     setIsCreateRoutesOpen(false);
  };
 const filteredRoutes = routes.filter(
    (route) =>
      route.StartTerminal.toLowerCase().includes(searchText.toLowerCase()) ||
     route.EndTerminal.toLowerCase().includes(searchText.toLowerCase()) 
     );
 
      const fetchRoutes = async () => {
        try {
          const res = await axios.get("http://localhost:5000/routes");
          setRoutes(res.data);
        } catch (err) {
          console.error("Failed to fetch stations:", err);
        }
      };
   useEffect(() => {
      fetchRoutes();
    }, []);


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this route?")) return;

  try {
    await axios.delete(`http://localhost:5000/routes/${id}`);
    setRoutes((prev) => prev.filter((s) => s.id !== id));
    alert("✅ route deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete station");
  }
};
  const columns = [
  {
    title: 'Start Terminal',
     dataIndex:'Start Terminal',
    key: 'End Terminal',
  },
  {
    title: 'End Terminal',
    dataIndex: 'End Terminal',
    key: 'End Terminal',
  },
   {
    title: 'Actions',
    key: 'actions',
     render: (_: any, record: Route) => (
          <div className="flex gap-2">
      <Button
        type="primary"
       // onClick={() => handleEdit(record)}
      >
        <TbEdit />
      
      </Button>
        {/* {isEditModalOpen && editingRoute && (
//   <EditStationModal
//     isOpen={isEditModalOpen}
//     handleCancel={closeEditModal}
//     station={editingStation}
//     onUpdated={handleStationUpdated}
//   />
)} */}
      <Button
        type="primary"
        danger
        onClick={() => handleDelete(record.id)}
      >
        <RiDeleteBin6Line />
      </Button>
    </div>
        
     )
  },
];
  const handleSearch = (value: string) => {
    setSearchText(value);
  
  };
return(
    
    <>
   <div className=" flex justify-end">
     <Input
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search stations"
            className="pl-10 rounded-2xl  w-[200px] h-11  mt-5"
          prefix={<CiSearch className="text-gray-400" />}
          />
    <Button
     className="mt-5 "
    onClick={showCreateRoutes}
    >
        Create New Routes
    </Button>
    {IsCreateRoutesOpen && <CreateRoutes isModalOpen={IsCreateRoutesOpen} handleCancel={closeCreateRoutes}  onRoutesCreated={fetchRoutes} />}
   </div>
   <div>
    <Table
    columns={columns}
     dataSource={filteredRoutes}
      rowKey="id"
    />
   </div>
    </>
)


}