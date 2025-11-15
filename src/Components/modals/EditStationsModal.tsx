import { Modal, Input, Button, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

type Station = {
  id: number;
  StationName: string;
  City: string;
  location: string;
};

type EditStationModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  station: Station | null;
  onUpdated: (updatedStation: Station) => void;
};

const EditStationModal: React.FC<EditStationModalProps> = ({
  isOpen,
  handleCancel,
  station,
  onUpdated,
}) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   if (isOpen && station) {
      setName(station.StationName);
      setCity(station.City);
      setLocation(station.location);
    }
  }, [isOpen, station]);

  const handleUpdate = async () => {
    if (!name || !city || !location) {
      message.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/stations/${station?.id}`, {
         name,
         city,
         location,
      });
      message.success(res.data.message || "✅ Station updated!");
      onUpdated({ ...station!, StationName: name, City: city, location: location });
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
        <Input placeholder="Station Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default EditStationModal;
