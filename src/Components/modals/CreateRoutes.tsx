// import {  Button, Input, message, Modal,  } from "antd";
// import axios from "axios";
// import { useState } from "react";

// type CreateRoutesProps = {
//    isModalOpen: boolean;
//   handleCancel: () => void;
//    onRoutesCreated?: () => void;
// };
// const CreateRoutes:  React.FC <CreateRoutesProps>= ({isModalOpen, handleCancel, onRoutesCreated}) => {


//   const [StartTerminal, setStartTerminal] = useState("");
//   const [EndTerminal, setEndTerminal] = useState("");
//   const [loading, setLoading] = useState(false);
//        const handleCreate = async () => {
//     if (!StartTerminal || !EndTerminal) {
//       message.warning("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//        const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "http://localhost:5000/routes",
        
//         { StartTerminal,EndTerminal},
      
//           {
//         headers: {
//           Authorization: `Bearer ${token}` // <--- Add token here
//         }
//       }
//       );

//      alert(res.data.message || "✅ Station created successfully!");
      
//        onRoutesCreated?.();
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
// title={"Create New Route"}
//  open={isModalOpen}
//   onCancel={handleCancel}
//       footer={null}
// >
//     <div className="w-full h-100 pt-30 md:space-x-4 space-y-4  ">
//         <Input className="w-50 h-11 md:w-1/3 rounded-md  " 
//         placeholder="Insert Start Terminal"
//           onChange={(e) => setStartTerminal(e.target.value)}
//         />
//          <Input className="w-50 h-11 rounded-md " 
//          placeholder="Insert End Terminal"
//            onChange={(e) => setEndTerminal(e.target.value)}
//          />
//         <Button
//           type="primary"
//           loading={loading}                                                 
//           onClick={handleCreate}
//           className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
//         >
//           Create Route
//         </Button>
        
//     </div>
// </Modal>
// );

// }; export default CreateRoutes




import { Button, Input, message, Modal } from "antd";
import axios from "axios";
import { useState } from "react";

type CreateRoutesProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onRoutesCreated?: () => void;
};

const CreateRoutes: React.FC<CreateRoutesProps> = ({
  isModalOpen,
  handleCancel,
  onRoutesCreated,
}) => {
  const [StartTerminal, setStartTerminal] = useState("");
  const [EndTerminal, setEndTerminal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!StartTerminal || !EndTerminal) {
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
        "http://localhost:5000/routes",
        { StartTerminal, EndTerminal },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Create route response:", res.data);
      message.success(res.data.message || "Route created successfully!");

      onRoutesCreated?.(); // Refresh routes in parent
      handleCancel();
    } catch (err: any) {
      console.error("Create route error:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create New Route" open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="space-y-4">
        <Input
          placeholder="Insert Start Terminal"
          value={StartTerminal}
          onChange={(e) => setStartTerminal(e.target.value)}
        />
        <Input
          placeholder="Insert End Terminal"
          value={EndTerminal}
          onChange={(e) => setEndTerminal(e.target.value)}
        />
        <Button type="primary" loading={loading} onClick={handleCreate} className="w-full">
          Create Route
        </Button>
      </div>
    </Modal>
  );
};

export default CreateRoutes;
