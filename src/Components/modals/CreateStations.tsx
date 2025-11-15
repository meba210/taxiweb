import {  Button, Input, message, Modal,  } from "antd";
import axios from "axios";
import { useState } from "react";

type CreateStationProps = {
   isModalOpen: boolean;
  handleCancel: () => void;
   onStationCreated?: () => void;
};
const CreateStations:  React.FC <CreateStationProps>= ({isModalOpen, handleCancel, onStationCreated}) => {


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
        { StationName, City, location},
        { withCredentials: true }
      );

     alert(res.data.message || "✅ Station created successfully!");
      
       onStationCreated?.();
       handleCancel(); 
    
    } catch (err: any) {
      console.error(err);
       alert(err.response?.data?.message || "Failed to create station");
    } finally {
      setLoading(false);
    }
  };
return(

    

<Modal
title={"Create New Station"}
 open={isModalOpen}
  onCancel={handleCancel}
      footer={null}
>
    <div className="w-full h-100 pt-30 md:space-x-4 space-y-4  ">
        <Input className="w-50 h-11 md:w-1/3 rounded-md  " 
        placeholder="Insert station name"
          onChange={(e) => setStationName(e.target.value)}
        />
         <Input className="w-50 h-11 rounded-md " 
         placeholder="Insert city"
           onChange={(e) => setCity(e.target.value)}
         />
        <Input className="w-50 h-11 rounded-md " 
        placeholder="Insert location"
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button
          type="primary"
          loading={loading}
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
        >
          Create Station
        </Button>
        
    </div>
</Modal>
);

}; export default CreateStations