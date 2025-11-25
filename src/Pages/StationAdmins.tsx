import { Button, Input, Table } from "antd";
import { useEffect, useState } from "react";
import CreateStationAdmin from "../Components/modals/CreateStationAdmin";
import { CiSearch } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditStationAdminModal from "../Components/modals/EditStationAdminModal";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
type StationAdmin = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: number;
   UserName: string;
   Stations:string;
};
export default function Stations () {
    const [IsCreateStationAdminOpen, setIsCreateStationAdminOpen] = useState(false);
     const [searchText, setSearchText] = useState("");
    const [EditingStationAdmin, setEditingStationAdmin] = useState<StationAdmin | null>(null);

     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
       const [StationAdmin , setStationAdmin ] = useState<StationAdmin []>([]);
  const showCreateStationAdmin = () => {
   setIsCreateStationAdminOpen(true);
  };

  const closeCreateStationAdmin = () => {
    setIsCreateStationAdminOpen(false);
  };
    const handleSearch = (value: string) => {
    setSearchText(value);
  
  };
  const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this station?")) return;

  try {
    await axios.delete(`http://localhost:5000/stationadmins/${id}`);
    setStationAdmin ((prev) => prev.filter((s) => s.id !== id));
    alert("✅ Station deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete station");
  }
};

const handleEdit = (stationadmin: StationAdmin) => {
  setEditingStationAdmin(stationadmin);
  setIsEditModalOpen(true);
};

const closeEditModal = () => {
  setIsEditModalOpen(false);
    setEditingStationAdmin(null);
};
const handleStationUpdated = (updatedStation:StationAdmin) => {
  setStationAdmin((prev) =>
    prev.map((s) => (s.id === updatedStation.id ? updatedStation : s))
  );
};
   const columns = [
    {
      title: 'Full Name',
       dataIndex: "FullName",
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'city',
    },
    {
      title: 'Phone Number',
      dataIndex: 'PhoneNumber',
      key: 'location',
    },
    {
     title: 'UserName',
      dataIndex: 'UserName',
      key: 'UserName',
    },
     {
     title: 'Stations',
      dataIndex: 'Stations',
      key: 'Stations',
    },
     {
      title: 'Actions',
      key: 'actions',
       render: (_: any, record: StationAdmin ) => (
            <div className="flex gap-2">
        <Button
          type="primary"
          onClick={() => handleEdit(record)}
        >
          <TbEdit />
        
        </Button>
          {isEditModalOpen && EditingStationAdmin && (
    <EditStationAdminModal
      isOpen={isEditModalOpen}
      handleCancel={closeEditModal}
      StationAdmin={EditingStationAdmin}
      onUpdated={handleStationUpdated}
    />
  )}
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
 const filteredStationAdmins = StationAdmin.filter(
    (stationAdmin) =>
       stationAdmin.FullName.toLowerCase().includes(searchText.toLowerCase()) 
     );
    
    
     const fetchStationAdmins = async () => {
    try {
      // ✅ Call filtered route for logged-in station admin
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/stationAdmins", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStationAdmin(res.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };
   useEffect(() => {
      fetchStationAdmins ();
    }, []);
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
    onClick={showCreateStationAdmin}
    >Create Station Admin
    </Button>
    {IsCreateStationAdminOpen && <CreateStationAdmin isModalOpen={IsCreateStationAdminOpen} handleCancel={closeCreateStationAdmin}  onStationAdminCreated={fetchStationAdmins}/>}
   </div>
     <div>
    <Table
    columns={columns}
     dataSource={filteredStationAdmins}
      rowKey="id"
    />
   </div>
    </>
)


}