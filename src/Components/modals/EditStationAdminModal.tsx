import { Modal, Input, Button, message, Select } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

type StationAdmin = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: number;
   UserName: string;
   Stations:string;
};

type Station = {
  StationName: string;
};

type EditStationAdminModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  StationAdmin: StationAdmin| null;
  onUpdated: (updatedStation: StationAdmin) => void;
};

const EditStationModal: React.FC<EditStationAdminModalProps> = ({
  isOpen,
  handleCancel,
 StationAdmin,
  onUpdated,
}) => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
 const [PhoneNumber, setPhoneNumber] = useState<number | undefined>();
   const [UserName, setUserName] = useState("");
     const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
   const [selectedStation, setSelectedStation] = useState<string>("");

 
    const fetchStationadmins = async () => {
      try {
        const res = await axios.get("http://localhost:5000/stationadmins");
        setStations(res.data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
      }
    };
     useEffect(() => {
    fetchStationadmins();
  }, []);


  useEffect(() => {
   if (isOpen && StationAdmin) {
      setFullName(StationAdmin.FullName);
     setEmail(StationAdmin.Email);
      setPhoneNumber(StationAdmin.PhoneNumber);
      setUserName(StationAdmin.UserName);
        setSelectedStation(StationAdmin.Stations);
    }
  }, [isOpen, StationAdmin]);

  const handleUpdate = async () => {
    if (!FullName|| !Email || !PhoneNumber||!UserName||!selectedStation) {
      message.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/stationadmins/${StationAdmin?.id}`, {
        FullName,
         Email,
         PhoneNumber,
         UserName,
            Stations: selectedStation,
      });
      message.success(res.data.message || "✅ Station updated!");
      onUpdated({ ...StationAdmin!, FullName: FullName, Email: Email, PhoneNumber: PhoneNumber, UserName: UserName,Stations: selectedStation,});
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to update station");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit Station" maskClosable={true}>
      <div className="space-y-3">
        <Input placeholder="Full Name" value={FullName} onChange={(e) => setFullName(e.target.value)} />
        <Input placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Phone Number" value={PhoneNumber} onChange={(e) => setPhoneNumber(Number(e.target.value))} />
        <Input placeholder="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} />
         <Select placeholder="select station"
            onChange={(value) => setSelectedStation(value)}
          value={selectedStation}
          options={stations.map((s) => ({
            label: s.StationName,
            value: s.StationName,
          }))}
         />
        <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default EditStationModal;
