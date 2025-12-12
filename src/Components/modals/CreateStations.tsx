// import {  Button, Input, message, Modal,  } from "antd";
// import axios from "axios";
// import { useState } from "react";

// type CreateStationProps = {
//    isModalOpen: boolean;
//   handleCancel: () => void;
//    onStationCreated?: () => void;
// };
// const CreateStations:  React.FC <CreateStationProps>= ({isModalOpen, handleCancel, onStationCreated}) => {


//   const [StationName, setStationName] = useState("");
//   const [City, setCity] = useState("");
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);
//        const handleCreate = async () => {
//     if (!StationName || !City || !location) {
//       message.warning("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/stations",
//         { StationName, City, location},
//         { withCredentials: true }
//       );

//      alert(res.data.message || "✅ Station created successfully!");
      
//        onStationCreated?.();
//        handleCancel(); 
    
//     } catch (err: any) {
//       console.error(err);
//        alert(err.response?.data?.message || "Failed to create station");
//     } finally {
//       setLoading(false);
//     }
//   };
// return(

    

// <Modal
// title={"Create New Station"}
//  open={isModalOpen}
//   onCancel={handleCancel}
//       footer={null}
// >
//     <div className="w-full h-100 pt-30 md:space-x-4 space-y-4  ">
//         <Input className="w-50 h-11 md:w-1/3 rounded-md  " 
//         placeholder="Insert station name"
//           onChange={(e) => setStationName(e.target.value)}
//         />
//          <Input className="w-50 h-11 rounded-md " 
//          placeholder="Insert city"
//            onChange={(e) => setCity(e.target.value)}
//          />
//         <Input className="w-50 h-11 rounded-md " 
//         placeholder="Insert location"
//           onChange={(e) => setLocation(e.target.value)}
//         />
//         <Button
//           type="primary"
//           loading={loading}
//           onClick={handleCreate}
//           className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
//         >
//           Create Station
//         </Button>
        
//     </div>
// </Modal>
// );

// }; export default CreateStations

import { Button, Input, message, Modal, Form, Space, Alert } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaBuilding, FaCity, FaMapMarkerAlt } from "react-icons/fa";

type CreateStationProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onStationCreated?: () => void;
};

const CreateStations: React.FC<CreateStationProps> = ({ 
  isModalOpen, 
  handleCancel, 
  onStationCreated 
}) => {
  const [StationName, setStationName] = useState("");
  const [City, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!StationName || !City || !location) {
      message.warning("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/stations",
        { 
          StationName: StationName.trim(),
          City: City.trim(),
          location: location.trim()
        },
        { withCredentials: true }
      );

      message.success(res.data.message || "✅ Station created successfully!");
      
      // Reset form
      setStationName("");
      setCity("");
      setLocation("");
      
      onStationCreated?.();
      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to create station");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setStationName("");
      setCity("");
      setLocation("");
    }
  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={window.innerWidth < 768 ? "90%" : 500}
      centered
      title={
        <div style={{ fontSize: window.innerWidth < 768 ? "18px" : "20px", fontWeight: "600" }}>
          <FaBuilding style={{ marginRight: "10px" }} />
          Create New Station
        </div>
      }
      styles={{
        body: { padding: window.innerWidth < 768 ? "16px 0" : "20px 0" }
      }}
    >
      <div style={{ maxWidth: "100%" }}>
        <Alert
          message="Create a new transportation station"
          type="info"
          showIcon
          style={{ 
            marginBottom: "20px", 
            borderRadius: "8px",
            fontSize: window.innerWidth < 768 ? "13px" : "14px"
          }}
        />

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
              value={StationName}
              onChange={(e) => setStationName(e.target.value)}
              size={window.innerWidth < 768 ? "middle" : "large"}
              prefix={<FaBuilding style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: "6px", width: "100%" }}
              maxLength={100}
            />
            {StationName && StationName.trim().length < 2 && (
              <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                Station name should be at least 2 characters
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
              value={City}
              onChange={(e) => setCity(e.target.value)}
              size={window.innerWidth < 768 ? "middle" : "large"}
              prefix={<FaCity style={{ color: "#bfbfbf" }} />}
              style={{ borderRadius: "6px", width: "100%" }}
              maxLength={50}
            />
            {City && City.trim().length < 2 && (
              <div style={{ color: "#ff4d4f", fontSize: "12px", marginTop: "4px" }}>
                City name should be at least 2 characters
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
          </div>
        </div>

        {/* Station Preview */}
        {StationName.trim() && City.trim() && location.trim() && (
          <Alert
            message="Station Preview"
            description={
              <div style={{ marginTop: "8px" }}>
                <div><strong>Name:</strong> {StationName.trim()}</div>
                <div><strong>City:</strong> {City.trim()}</div>
                <div><strong>Location:</strong> {location.trim()}</div>
              </div>
            }
            type="info"
            style={{ 
              marginTop: "20px", 
              marginBottom: "20px", 
              borderRadius: "8px",
              fontSize: window.innerWidth < 768 ? "13px" : "14px"
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
            onClick={handleCreate}
            size={window.innerWidth < 768 ? "middle" : "large"}
            disabled={!StationName.trim() || !City.trim() || !location.trim()}
            style={{ 
              borderRadius: "6px", 
              flex: 1,
              background: (StationName.trim() && City.trim() && location.trim()) ? '#1890ff' : '#d9d9d9',
              borderColor: (StationName.trim() && City.trim() && location.trim()) ? '#1890ff' : '#d9d9d9'
            }}
            icon={<FaBuilding />}
          >
            {loading ? 'Creating...' : 'Create Station'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateStations;