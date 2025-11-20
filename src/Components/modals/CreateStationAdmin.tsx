import {  Button, Input, message, Modal, Select,  } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

type CreateStationAdminProps = {
   isModalOpen: boolean;
  handleCancel: () => void;
   onStationAdminCreated?: () => void;
};
type Station = {
  id:number,
  StationName: string;
};
const CreateStationAdmin:  React.FC <CreateStationAdminProps>= ({isModalOpen, handleCancel,onStationAdminCreated}) => {
     
    const [FullName, setFullName] = useState("");
      const [PhoneNumber, setPhoneNumber] = useState("");
      const [Email, setEmail] = useState("");
      const [UserName, setUserName] = useState("");
    const [stations, setStations] = useState<Station[]>([]);
      const [loading, setLoading] = useState(false);
      const [selectedStation, setSelectedStation] = useState<number | undefined>();


       useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/stations");
        setStations(res.data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
      }
    };

    fetchStations();
  }, []);

        const handleCreate = async () => {
    if (!FullName || !Email || !PhoneNumber || !UserName || !selectedStation) {
      message.warning("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/stationadmins",
        { FullName, Email, PhoneNumber,UserName,selectedStation,role_id: 2},
        { withCredentials: true }
      );

     alert(res.data.message || "✅ Station created successfully!");
      handleCancel(); 
      onStationAdminCreated?.(); // refresh data
    } catch (err: any) {
      console.error(err);
       alert(err.response?.data?.message || "Failed to create station");
    } finally {
      setLoading(false);
    }
        }
return(

<Modal
 open={isModalOpen}
  onCancel={handleCancel}
  footer={null}
>
    <div>
        <Input placeholder="Insert Full name"
         onChange={(e) => setFullName(e.target.value)}
        />
         <Input placeholder="Insert email"
         onChange={(e) => setEmail(e.target.value)}
         />
        <Input placeholder="Insert Phonenumber"
        onChange={(e) => setPhoneNumber(e.target.value)}
        />
           <Input placeholder="Insert username"
           onChange={(e) => setUserName(e.target.value)}
           />
         <Select placeholder="select station"
           onChange={(value) => setSelectedStation(value)}
              value={selectedStation}
         options={stations.map((s) => ({ label: s.StationName,value: s.id, }))}
         />
          <Button
          type="primary"
          loading={loading}
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
        >
          Create Admin
        </Button>
    </div>
</Modal>
);

}; export default CreateStationAdmin