// import { Modal, Input, Button, message } from "antd";
// import { useState, useEffect } from "react";
// import axios from "axios";

// type Station = {
//   id: number;
//   StationName: string;
//   City: string;
//   location: string;
// };

// type EditStationModalProps = {
//   isOpen: boolean;
//   handleCancel: () => void;
//   station: Station | null;
//   onUpdated: (updatedStation: Station) => void;
// };

// const EditStationModal: React.FC<EditStationModalProps> = ({
//   isOpen,
//   handleCancel,
//   station,
//   onUpdated,
// }) => {
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//    if (isOpen && station) {
//       setName(station.StationName);
//       setCity(station.City);
//       setLocation(station.location);
//     }
//   }, [isOpen, station]);

//   const handleUpdate = async () => {
//     if (!name || !city || !location) {
//       message.warning("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.put(`http://localhost:5000/stations/${station?.id}`, {
//          name,
//          city,
//          location,
//       });
//       message.success(res.data.message || "✅ Station updated!");
//       onUpdated({ ...station!, StationName: name, City: city, location: location });
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to update station");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit Station" maskClosable={true}>
//       <div className="space-y-3">
//         <Input placeholder="Station Name" value={name} onChange={(e) => setName(e.target.value)} />
//         <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
//         <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
//         <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
//           Save
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default EditStationModal;


import { Modal, Input, Button, message, Alert, Space } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding, FaCity, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

type Station = {
  id: number;
  StationName: string;
  City: string;
  location: string;
   status: 'active' | 'inactive';
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
  const [originalStation, setOriginalStation] = useState<Station | null>(null);

  useEffect(() => {
    if (isOpen && station) {
      setName(station.StationName);
      setCity(station.City);
      setLocation(station.location);
      setOriginalStation(station);
    }
  }, [isOpen, station]);

  // Check if form has changes
  const hasChanges = () => {
    if (!originalStation) return false;
    return name.trim() !== originalStation.StationName || 
           city.trim() !== originalStation.City || 
           location.trim() !== originalStation.location;
  };

  // Form validation
  const isFormValid = () => {
    return name.trim().length >= 2 && 
           city.trim().length >= 2 && 
           location.trim().length >= 3;
  };

  const handleUpdate = async () => {
    // Validation
    if (!name.trim()) {
      message.warning("Please enter station name");
      return;
    }

    if (name.trim().length < 2) {
      message.warning("Station name should be at least 2 characters");
      return;
    }

    if (!city.trim()) {
      message.warning("Please enter city name");
      return;
    }

    if (city.trim().length < 2) {
      message.warning("City name should be at least 2 characters");
      return;
    }

    if (!location.trim()) {
      message.warning("Please enter location details");
      return;
    }

    if (location.trim().length < 3) {
      message.warning("Location should be at least 3 characters");
      return;
    }

    // Check for changes
    if (!hasChanges()) {
      message.info("No changes detected");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/stations/${station?.id}`, {
        name: name.trim(),
        city: city.trim(),
        location: location.trim(),
      });
      message.success(res.data.message || "✅ Station updated!");
      onUpdated({ ...station!, StationName: name.trim(), City: city.trim(), location: location.trim() });
      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to update station");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={window.innerWidth < 768 ? "90%" : 500}
      centered
      title={
        <div style={{ 
          fontSize: window.innerWidth < 768 ? "18px" : "20px", 
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <FaEdit />
          Edit Station
          {station && (
            <span style={{ 
              fontSize: "12px", 
              color: "#8c8c8c",
              fontWeight: "normal"
            }}>
              ID: {station.id}
            </span>
          )}
        </div>
      }
      styles={{
        body: { padding: window.innerWidth < 768 ? "16px 0" : "20px 0" }
      }}
    >
      <div style={{ maxWidth: "100%" }}>
        {/* Alert Message */}
        {station && (
          <Alert
            message="Update station information"
            description={`Editing: ${station.StationName}`}
            type="info"
            showIcon
            style={{ 
              marginBottom: "20px", 
              borderRadius: "8px",
              fontSize: window.innerWidth < 768 ? "13px" : "14px"
            }}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Station Name */}
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "6px",
              fontSize: window.innerWidth < 768 ? "14px" : "15px",
              fontWeight: "500" 
            }}>
              <FaBuilding style={{ marginRight: "8px", fontSize: "14px" }} />
              Station Name
            </div>
            <Input
              placeholder="e.g., Bole Airport Terminal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size={window.innerWidth < 768 ? "middle" : "large"}
              prefix={<FaBuilding style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: "6px", width: "100%" }}
              maxLength={100}
            />
            {name && name.trim().length < 2 && (
              <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                Station name should be at least 2 characters
              </div>
            )}
            {originalStation && name.trim() !== originalStation.StationName && (
              <div style={{ color: "#1890ff", fontSize: "12px", marginTop: "4px" }}>
                Changed from: {originalStation.StationName}
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "6px",
              fontSize: window.innerWidth < 768 ? "14px" : "15px",
              fontWeight: "500" 
            }}>
              <FaCity style={{ marginRight: "8px", fontSize: "14px" }} />
              City
            </div>
            <Input
              placeholder="e.g., Addis Ababa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              size={window.innerWidth < 768 ? "middle" : "large"}
              prefix={<FaCity style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: "6px", width: "100%" }}
              maxLength={50}
            />
            {city && city.trim().length < 2 && (
              <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                City name should be at least 2 characters
              </div>
            )}
            {originalStation && city.trim() !== originalStation.City && (
              <div style={{ color: "#1890ff", fontSize: "12px", marginTop: "4px" }}>
                Changed from: {originalStation.City}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              marginBottom: "6px",
              fontSize: window.innerWidth < 768 ? "14px" : "15px",
              fontWeight: "500" 
            }}>
              <FaMapMarkerAlt style={{ marginRight: "8px", fontSize: "14px" }} />
              Location Details
            </div>
            <Input
              placeholder="e.g., Near Bole Medhanialem Church"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              size={window.innerWidth < 768 ? "middle" : "large"}
              prefix={<FaMapMarkerAlt style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: "6px", width: "100%" }}
              maxLength={200}
            />
            {location && location.trim().length < 3 && (
              <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                Location should be at least 3 characters
              </div>
            )}
            {originalStation && location.trim() !== originalStation.location && (
              <div style={{ color: "#1890ff", fontSize: "12px", marginTop: "4px" }}>
                Changed from: {originalStation.location}
              </div>
            )}
          </div>
        </div>

        {/* Preview Changes */}
        {hasChanges() && isFormValid() && (
          <Alert
            message="Changes Preview"
            description={
              <div style={{ marginTop: "8px", fontSize: window.innerWidth < 768 ? "13px" : "14px" }}>
                <div><strong>Station:</strong> {name.trim()}</div>
                <div><strong>City:</strong> {city.trim()}</div>
                <div><strong>Location:</strong> {location.trim()}</div>
              </div>
            }
            type="info"
            style={{ 
              marginTop: "20px", 
              marginBottom: "20px", 
              borderRadius: "8px"
            }}
          />
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          marginTop: "24px",
          flexDirection: window.innerWidth < 768 ? "column" : "row"
        }}>
          <Button
            onClick={handleCancel}
            size={window.innerWidth < 768 ? "middle" : "large"}
            style={{ 
              borderRadius: "6px", 
              flex: window.innerWidth < 768 ? 1 : "none",
              width: window.innerWidth < 768 ? "100%" : "auto"
            }}
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            loading={loading}
            onClick={handleUpdate}
            size={window.innerWidth < 768 ? "middle" : "large"}
            disabled={!isFormValid() || !hasChanges()}
            style={{ 
              borderRadius: "6px", 
              flex: 1,
              background: (isFormValid() && hasChanges()) ? '#1890ff' : '#d9d9d9',
              borderColor: (isFormValid() && hasChanges()) ? '#1890ff' : '#d9d9d9'
            }}
            icon={<FaEdit />}
          >
            {loading ? 'Updating...' : 'Update Station'}
          </Button>
        </div>
       
      </div>
    </Modal>
  );
};

export default EditStationModal;