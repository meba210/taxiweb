import {  Button, Input, message, Modal, Select,  } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

type CreateDispachersProps = {
   isModalOpen: boolean;
  handleCancel: () => void;
   onDispachersCreated?: () => void;
};
type Routes = {
  id:number,
 StartTerminal: string;
 EndTerminal:string;
};
const CreateDispachers:  React.FC <CreateDispachersProps>= ({isModalOpen, handleCancel,onDispachersCreated}) => {
     
    const [FullName, setFullName] = useState("");
      const [PhoneNumber, setPhoneNumber] = useState("");
      const [Email, setEmail] = useState("");
      const [UserName, setUserName] = useState("");
    const [routes, setRoutes] = useState<Routes[]>([]);
      const [loading, setLoading] = useState(false);
     const [selectedRoute, setselectedRoute] = useState<string | undefined>();


const token = localStorage.getItem("token");
  if (!token) console.warn("No token found! Login required.");
       useEffect(() => {
    const fetchRoutes = async () => {
      if (!token) return;
      try {
         const res = await axios.get("http://localhost:5000/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
        setRoutes(res.data);
      } catch (err:any) {
        console.error("Failed to fetch stations:", err);
         message.error(err.response?.data?.message || "Failed to fetch routes");
      }
    };

    fetchRoutes();
  }, []);

        const handleCreate = async () => {
    if (!FullName || !Email || !PhoneNumber || !UserName || !selectedRoute) {
      message.warning("Please fill in all fields");
      return;
    }

      const token = localStorage.getItem("token");
    if (!token) {
      message.error("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/dispachers",
        { FullName, Email, PhoneNumber,UserName, Routes: selectedRoute,role_id: 3},
        { headers: { Authorization: `Bearer ${token}` } }
      );

     alert(res.data.message || "✅ Dispacher created successfully!");
      handleCancel(); 
      onDispachersCreated?.(); // refresh data
    } catch (err: any) {
      console.error(err);
       alert(err.response?.data?.message || "Failed to create Dispacher");
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
        <Select
  placeholder="Select Route"
  value={selectedRoute}
  onChange={(value) => setselectedRoute(value)}
  options={routes.map((r) => ({
    label: `${r.StartTerminal} → ${r.EndTerminal}`,
    value: `${r.StartTerminal} → ${r.EndTerminal}`, 
  }))}
/>

          <Button
          type="primary"
          loading={loading}
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
        >
          Create Dispacher
        </Button>
    </div>
</Modal>
);

}; export default CreateDispachers