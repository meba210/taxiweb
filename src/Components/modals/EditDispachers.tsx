import { Modal, Input, Button, message, Select } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

type Dispacher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: number;
   UserName: string;
   Routes:string;
};

type Route = {
  id:number,
 StartTerminal: string;
 EndTerminal:string;
};

type EditDispachersModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  Dispacher:  Dispacher| null;
  onUpdated: (updatedDispacher: Dispacher) => void;
};

const EditDispachersModal: React.FC<EditDispachersModalProps> = ({
  isOpen,
  handleCancel,
 Dispacher,
  onUpdated,
}) => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
 const [PhoneNumber, setPhoneNumber] = useState<number | undefined>();
   const [UserName, setUserName] = useState("");
     const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
   const [selectedRoute, setSelectedRoute] = useState<string>("");

 
    const fetchDispachers= async () => {
      try {
        const res = await axios.get("http://localhost:5000/routes");
        setRoutes(res.data);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      }
    };
     useEffect(() => {
    fetchDispachers();
  }, []);


  useEffect(() => {
   if (isOpen && Dispacher) {
      setFullName(Dispacher.FullName);
     setEmail(Dispacher.Email);
      setPhoneNumber(Dispacher.PhoneNumber);
      setUserName(Dispacher.UserName);
        setSelectedRoute(Dispacher.Routes);
    }
  }, [isOpen, Dispacher]);

  const handleUpdate = async () => {
    if (!FullName|| !Email || !PhoneNumber||!UserName||!selectedRoute) {
      message.warning("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/dispachers/${Dispacher?.id}`, {
        FullName,
         Email,
         PhoneNumber,
         UserName,
            Routes: selectedRoute,
      });
      message.success(res.data.message || "✅ Station updated!");
      onUpdated({ ...Dispacher!, FullName: FullName, Email: Email, PhoneNumber: PhoneNumber, UserName: UserName,Routes: selectedRoute,});
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit route" maskClosable={true}>
      <div className="space-y-3">
        <Input placeholder="Full Name" value={FullName} onChange={(e) => setFullName(e.target.value)} />
        <Input placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Phone Number" value={PhoneNumber} onChange={(e) => setPhoneNumber(Number(e.target.value))} />
        <Input placeholder="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} />
           <Select placeholder="select Route"
           onChange={(value) => setSelectedRoute(value)}
              value={selectedRoute}
         options={routes.map((r) => ({
    label: `${r.StartTerminal} → ${r.EndTerminal}`,  value: `${r.StartTerminal} → ${r.EndTerminal}`,  }))}
         />
        <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default EditDispachersModal;
