import { Button, Input, message, Table } from "antd";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditDispachersModal from "../Components/modals/EditDispachers";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import CreateDispachers from "../Components/modals/CreateDispachers";
type Dispacher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: number;
   UserName: string;
   Routes:string;
};
export default function Dispachers () {
    const [IsCreateDispachersOpen, setIsCreateDispachersOpen] = useState(false);
     const [searchText, setSearchText] = useState("");
    const [EditingDispachers, setEditingDispachers] = useState<Dispacher | null>(null);

     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
       const [dispacher , setDispacher ] = useState<Dispacher []>([]);
  const showCreateDispacher = () => {
   setIsCreateDispachersOpen(true);
  };

  const closeCreateDispacher = () => {
     setIsCreateDispachersOpen(false);
  };
    const handleSearch = (value: string) => {
    setSearchText(value);
  
  };
  const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this dispacher?")) return;
   if (!token) return;

  try {
    const res = await axios.delete(`http://localhost:5000/dispachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     message.success(res.data.message || "Route deleted");
      fetchDispachers(); // Refresh routes
    } catch (err: any) {
      console.error("Failed to delete route:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to delete route");
    }
  };

const handleEdit = (dispacher: Dispacher) => {
 setEditingDispachers(dispacher);
  setIsEditModalOpen(true);
};

const closeEditModal = () => {
  setIsEditModalOpen(false);
    setEditingDispachers(null);
};
const handleDispacherUpdated = (updatedDispacher:Dispacher) => {
  setDispacher((prev) =>
    prev.map((d) => (d.id === updatedDispacher.id ? updatedDispacher : d))
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
     title: 'Routes',
        dataIndex: 'Routes',
      key: 'routes',
    },
     {
      title: 'Actions',
      key: 'actions',
       render: (_: any, record:Dispacher ) => (
            <div className="flex gap-2">
        <Button
          type="primary"
         onClick={() => handleEdit(record)}
        >
          <TbEdit />
        
        </Button>
          {isEditModalOpen && EditingDispachers && (
    <EditDispachersModal
      isOpen={isEditModalOpen}
      handleCancel={closeEditModal}
      Dispacher={EditingDispachers}
      onUpdated={handleDispacherUpdated}
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
 const filteredDispachers = dispacher.filter(
    (dispacher) =>
       dispacher.FullName.toLowerCase().includes(searchText.toLowerCase()) 
     );

      const token = localStorage.getItem("token");
  if (!token) console.warn("No token found! Login required.");

     const fetchDispachers = async () => {
        try {
           const res = await axios.get("http://localhost:5000/dispachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
          setDispacher(res.data);
        } catch (err:any) {
          console.error("Failed to fetch dispachers:", err);
          message.error(err.response?.data?.message || "Failed to fetch routes");
        }
      };
   useEffect(() => {
     fetchDispachers  ();
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
    onClick={showCreateDispacher}
    >Create New Dispachers
    </Button>
    {IsCreateDispachersOpen && <CreateDispachers isModalOpen={IsCreateDispachersOpen} handleCancel={closeCreateDispacher}  onDispachersCreated={fetchDispachers}/>}
   </div>
     <div>
    <Table
    columns={columns}
     dataSource={filteredDispachers}
      rowKey="id"
    />
   </div>
    </>
)
}