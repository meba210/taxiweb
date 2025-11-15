import { Button, Input, Table } from "antd";
import { useEffect, useState } from "react";
import CreateStations from "../Components/modals/CreateStations";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import EditStationModal from "../Components/modals/EditStationsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
type Station = {
  id: number;
  StationName: string;
  City: string;
  location:string;
};
export default function Stations () {
    const [IsCreateStationOpen, setIsCreateStationOpen] = useState(false);
    const [stations, setStations] = useState<Station[]>([]);
      const [searchText, setSearchText] = useState("");
      const [editingStation, setEditingStation] = useState<Station | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
};
  const showCreateStation = () => {
   setIsCreateStationOpen(true);
  };

  const closeCreateStation = () => {
    setIsCreateStationOpen(false);
  };
 const filteredStations = stations.filter(
    (station) =>
       station.StationName.toLowerCase().includes(searchText.toLowerCase()) ||
      station.City.toLowerCase().includes(searchText.toLowerCase()) ||
      station.location.toLowerCase().includes(searchText.toLowerCase())
     );
 
      const fetchStations = async () => {
        try {
          const res = await axios.get("http://localhost:5000/stations");
          setStations(res.data);
        } catch (err) {
          console.error("Failed to fetch stations:", err);
        }
      };
   useEffect(() => {
      fetchStations();
    }, []);


const handleDelete = async (id: number) => {
  if (!confirm("Are you sure you want to delete this station?")) return;

  try {
    await axios.delete(`http://localhost:5000/stations/${id}`);
    setStations((prev) => prev.filter((s) => s.id !== id));
    alert("✅ Station deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to delete station");
  }
};
  const columns = [
  {
    title: 'Stations Name',
     dataIndex: "StationName",
    key: 'name',
  },
  {
    title: 'City',
    dataIndex: 'City',
    key: 'city',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
   {
    title: 'Actions',
    key: 'actions',
     render: (_: any, record: Station) => (
          <div className="flex gap-2">
      <Button
        type="primary"
        onClick={() => handleEdit(record)}
      >
        <TbEdit />
      
      </Button>
        {isEditModalOpen && editingStation && (
  <EditStationModal
    isOpen={isEditModalOpen}
    handleCancel={closeEditModal}
    station={editingStation}
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
    onClick={showCreateStation}
    >Create New Station
    </Button>
    {IsCreateStationOpen && <CreateStations isModalOpen={IsCreateStationOpen} handleCancel={closeCreateStation}  onStationCreated={fetchStations} />}
   </div>
   <div>
    <Table
    columns={columns}
     dataSource={filteredStations}
      rowKey="id"
    />
   </div>
    </>
)


}