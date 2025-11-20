import { Modal, Input, Button, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

type Routes= {
  id: number;
  StartTerminal: string;
  EndTerminal: string;
 
};

type EditRoutesModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  route: Routes | null;
  onUpdated: (updatedRoute: Routes) => void;
};

const EditRoutesModal: React.FC<EditRoutesModalProps> = ({
  isOpen,
  handleCancel,
  route,
  onUpdated,
}) => {
  const [StartTerminal, setStartTerminal] = useState("");
  const [EndTerminal, setEndTerminal] = useState("");
 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   if (isOpen && route) {
     setStartTerminal(route.StartTerminal);
       setEndTerminal(route. EndTerminal);
   
    }
  }, [isOpen, route]);

  const handleUpdate = async () => {
   
    if (!StartTerminal|| !EndTerminal ) {
      message.warning("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/routes/${route?.id}`, {
         StartTerminal,
        EndTerminal,
         
      },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
    );
      message.success(res.data.message || "✅route updated!");
      onUpdated({ ...route!, StartTerminal: StartTerminal,  EndTerminal:  EndTerminal });
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit Route" maskClosable={true}>
      <div className="space-y-3">
        <Input placeholder="StartTerminal" value={StartTerminal} onChange={(e) => setStartTerminal(e.target.value)} />
        <Input placeholder=" EndTerminal" value={ EndTerminal} onChange={(e) => setEndTerminal(e.target.value)} />
       
        <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default EditRoutesModal;
