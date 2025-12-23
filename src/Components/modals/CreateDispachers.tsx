// import {  Button, Input, message, Modal, Select,  } from "antd";
// import axios from "axios";
// import { useEffect, useState } from "react";

// type CreateDispachersProps = {
//    isModalOpen: boolean;
//   handleCancel: () => void;
//    onDispachersCreated?: () => void;
// };
// type Routes = {
//   id:number,
//  StartTerminal: string;
//  EndTerminal:string;
// };
// const CreateDispachers:  React.FC <CreateDispachersProps>= ({isModalOpen, handleCancel,onDispachersCreated}) => {
     
//     const [FullName, setFullName] = useState("");
//       const [PhoneNumber, setPhoneNumber] = useState("");
//       const [Email, setEmail] = useState("");
//       const [UserName, setUserName] = useState("");
//     const [routes, setRoutes] = useState<Routes[]>([]);
//       const [loading, setLoading] = useState(false);
//      const [selectedRoute, setselectedRoute] = useState<string | undefined>();


// const token = localStorage.getItem("token");
//   if (!token) console.warn("No token found! Login required.");
//        useEffect(() => {
//     const fetchRoutes = async () => {
//       if (!token) return;
//       try {
//          const res = await axios.get("http://localhost:5000/routes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//         setRoutes(res.data);
//       } catch (err:any) {
//         console.error("Failed to fetch stations:", err);
//          message.error(err.response?.data?.message || "Failed to fetch routes");
//       }
//     };

//     fetchRoutes();
//   }, []);

//         const handleCreate = async () => {
//     if (!FullName || !Email || !PhoneNumber || !UserName || !selectedRoute) {
//       message.warning("Please fill in all fields");
//       return;
//     }

//       const token = localStorage.getItem("token");
//     if (!token) {
//       message.error("No token found. Please login again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/dispachers",
//         { FullName, Email, PhoneNumber,UserName, Routes: selectedRoute,role_id: 3},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//      alert(res.data.message || "✅ Dispacher created successfully!");
//       handleCancel(); 
//       onDispachersCreated?.(); // refresh data
//     } catch (err: any) {
//       console.error(err);
//        alert(err.response?.data?.message || "Failed to create Dispacher");
//     } finally {
//       setLoading(false);
//     }
//         }
// return(

// <Modal
//  open={isModalOpen}
//   onCancel={handleCancel}
//   footer={null}
// >
//     <div>
//         <Input placeholder="Insert Full name"
//          onChange={(e) => setFullName(e.target.value)}
//         />
//          <Input placeholder="Insert email"
//          onChange={(e) => setEmail(e.target.value)}
//          />
//         <Input placeholder="Insert Phonenumber"
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         />
//            <Input placeholder="Insert username"
//            onChange={(e) => setUserName(e.target.value)}
//            />
//         <Select
//   placeholder="Select Route"
//   value={selectedRoute}
//   onChange={(value) => setselectedRoute(value)}
//   options={routes.map((r) => ({
//     label: `${r.StartTerminal} → ${r.EndTerminal}`,
//     value: `${r.StartTerminal} → ${r.EndTerminal}`, 
//   }))}
// />

//           <Button
//           type="primary"
//           loading={loading}
//           onClick={handleCreate}
//           className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
//         >
//           Create Dispacher
//         </Button>
//     </div>
// </Modal>
// );

// }; export default CreateDispachers


// import { Button, Input, message, Modal, Select, Form, Card, Space, Typography, Tag, Alert } from "antd";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { FaUserPlus, FaRoute, FaPhoneAlt, FaEnvelope, FaUser, FaExclamationCircle } from "react-icons/fa";

// const { Title, Text } = Typography;

// type CreateDispachersProps = {
//   isModalOpen: boolean;
//   handleCancel: () => void;
//   onDispachersCreated?: () => void;
// };

// type Routes = {
//   id: number;
//   StartTerminal: string;
//   EndTerminal: string;
// };

// const CreateDispachers: React.FC<CreateDispachersProps> = ({ 
//   isModalOpen, 
//   handleCancel, 
//   onDispachersCreated 
// }) => {
//   const [form] = Form.useForm();
//   const [FullName, setFullName] = useState("");
//   const [PhoneNumber, setPhoneNumber] = useState("");
//   const [Email, setEmail] = useState("");
//   const [UserName, setUserName] = useState("");
//   const [routes, setRoutes] = useState<Routes[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRoute, setselectedRoute] = useState<string | undefined>();
//   const [isFormValid, setIsFormValid] = useState(false);

//   // Get token - same logic
//   const token = localStorage.getItem("token");
//   if (!token) console.warn("No token found! Login required.");

//   useEffect(() => {
//     const fetchRoutes = async () => {
//       if (!token) return;
//       try {
//         const res = await axios.get("http://localhost:5000/routes", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRoutes(res.data);
//       } catch (err: any) {
//         console.error("Failed to fetch stations:", err);
//         message.error(err.response?.data?.message || "Failed to fetch routes");
//       }
//     };

//     fetchRoutes();
//   }, []);

//   // Check form validity
//   useEffect(() => {
//     const isValid = FullName && Email && PhoneNumber && UserName && selectedRoute;
//     setIsFormValid(!!isValid);
//   }, [FullName, Email, PhoneNumber, UserName, selectedRoute]);

//   const handleCreate = async () => {
//     // Validation - enhanced with specific messages
//     if (!FullName) {
//       message.warning("Please enter the dispatcher's full name");
//       return;
//     }
//     if (!Email) {
//       message.warning("Please enter a valid email address");
//       return;
//     }
//     if (!PhoneNumber) {
//       message.warning("Please enter a phone number");
//       return;
//     }
//     if (!UserName) {
//       message.warning("Please enter a username");
//       return;
//     }
//     if (!selectedRoute) {
//       message.warning("Please select an assigned route");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(Email)) {
//       message.warning("Please enter a valid email address");
//       return;
//     }

//     // Phone number validation (basic)
//     const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
//     if (!phoneRegex.test(PhoneNumber.replace(/\s/g, ''))) {
//       message.warning("Please enter a valid phone number");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       message.error("No token found. Please login again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/dispachers",
//         { 
//           FullName, 
//           Email, 
//           PhoneNumber, 
//           UserName, 
//           Routes: selectedRoute, 
//           role_id: 3 
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       message.success({
//         content: res.data.message || "✅ Dispatcher created successfully!",
//         duration: 3,
//       });
      
//       // Reset form
//       setFullName("");
//       setEmail("");
//       setPhoneNumber("");
//       setUserName("");
//       setselectedRoute(undefined);
//       form.resetFields();
      
//       handleCancel();
//       onDispachersCreated?.(); // refresh data
//     } catch (err: any) {
//       console.error(err);
//       message.error({
//         content: err.response?.data?.message || "Failed to create dispatcher",
//         duration: 4,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form when modal opens/closes
//   useEffect(() => {
//     if (!isModalOpen) {
//       setFullName("");
//       setEmail("");
//       setPhoneNumber("");
//       setUserName("");
//       setselectedRoute(undefined);
//       form.resetFields();
//     }
//   }, [isModalOpen]);

//   return (
//     <Modal
//       open={isModalOpen}
//       onCancel={handleCancel}
//       footer={null}
//       width={600}
//       centered
//       title={
//         <Space align="center">
//           <div style={{
//             backgroundColor: '#1890ff',
//             borderRadius: '8px',
//             padding: '8px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <FaUserPlus size={20} color="#fff" />
//           </div>
//           <Title level={4} style={{ margin: 0 }}>Create New Dispatcher</Title>
//         </Space>
//       }
//       styles={{
//         body: { padding: '24px 0' },
//         header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }
//       }}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         style={{ maxWidth: '100%' }}
//       >
//         <Alert
//           message="Enter dispatcher details and assign a route"
//           description="All fields are required to create a new dispatcher account"
//           type="info"
//           showIcon
//           icon={<FaExclamationCircle />}
//           style={{ marginBottom: 24, borderRadius: '8px' }}
//         />

//         {/* Personal Information Card */}
//         <Card
//           title={
//             <Space>
//               <FaUser style={{ color: '#1890ff' }} />
//               <Text strong>Personal Information</Text>
//             </Space>
//           }
//           size="small"
//           style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
//           bodyStyle={{ padding: '16px' }}
//         >
//           <Form.Item
//             label={
//               <Space size={4}>
//                 <FaUser size={12} />
//                 <Text strong>Full Name</Text>
//               </Space>
//             }
//             required
//             validateStatus={FullName ? (
//           /^[A-Za-z\s]+$/.test(FullName.trim()) && FullName.trim().length >= 2
//             ? 'success' 
//             : 'error'
//         )  : ''}
//             help={FullName ? (!/^[A-Za-z\s]+$/.test(FullName.trim()) && FullName.trim().length >= 2 ? 'Invalid full name' : "") : "Required field"}
//           >
//             <Input
//               placeholder="Abebe"
//               value={FullName}
//               onChange={(e) => setFullName(e.target.value)}
//               size="large"
//               prefix={<FaUser style={{ color: '#bfbfbf' }} />}
//               style={{ borderRadius: '6px' }}
//               allowClear
//             />
//           </Form.Item>

//           <Form.Item
//             label={
//               <Space size={4}>
//                 <FaEnvelope size={12} />
//                 <Text strong>Email Address</Text>
//               </Space>
//             }
//             required
//             validateStatus={Email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) ? 'success' : 'error') : ''}
//             help={Email ? (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) ? 'Invalid email format' : "") : "Required field"}
//           >
//             <Input
//               placeholder="abe@example.com"
//               value={Email}
//               onChange={(e) => setEmail(e.target.value)}
//               size="large"
//               prefix={<FaEnvelope style={{ color: '#bfbfbf' }} />}
//               style={{ borderRadius: '6px' }}
//               allowClear
//             />
//           </Form.Item>

//          <Form.Item
//   label={
//     <Space size={4}>
//       <FaPhoneAlt size={12} />
//       <Text strong>Phone Number</Text>
//     </Space>
//   }
//   required
//   validateStatus={
//     PhoneNumber 
//       ? (
//           (/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')) 
         
//             ? 'success' 
//             : 'error'
//         ) )
//       :''
//       }
     
  
//   help={
//     PhoneNumber 
//       ? (
//           !(/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')))
//             ? 'Invalid phone number. Use  09XXXXXXXXX' 
//             : ""
//         ) 
//       : "Required field"
//   }
// >
//   <Input
//     placeholder="09XXXXXXXXX"
//     value={PhoneNumber}
//     onChange={(e) => setPhoneNumber(e.target.value)}
//     size="large"
//     prefix={<FaPhoneAlt style={{ color: '#bfbfbf' }} />}
//     style={{ borderRadius: '6px' }}
//     allowClear
//   />
// </Form.Item>
//         </Card>

//         {/* Account Information Card */}
//         <Card
//           title={
//             <Space>
//               <FaUserPlus style={{ color: '#1890ff' }} />
//               <Text strong>Account Information</Text>
//             </Space>
//           }
//           size="small"
//           style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
//           bodyStyle={{ padding: '16px' }}
//         >
//           <Form.Item
//             label={
//               <Space size={4}>
//                 <FaUser size={12} />
//                 <Text strong>Username</Text>
//               </Space>
//             }
//             required
//             validateStatus={UserName ? 'success' : ''}
//             help={!UserName ? "Required field" : ""}
//           >
//             <Input
//               placeholder="abe123"
//               value={UserName}
//               onChange={(e) => setUserName(e.target.value)}
//               size="large"
//               prefix={<FaUser style={{ color: '#bfbfbf' }} />}
//               style={{ borderRadius: '6px' }}
//               allowClear
//             />
//           </Form.Item>
//         </Card>

//         {/* Route Assignment Card */}
//         <Card
//           title={
//             <Space>
//               <FaRoute style={{ color: '#1890ff' }} />
//               <Text strong>Route Assignment</Text>
//               {selectedRoute && (
//                 <Tag color="green" style={{ marginLeft: '8px' }}>Route Selected</Tag>
//               )}
//             </Space>
//           }
//           size="small"
//           style={{ marginBottom: 32, borderColor: '#e8e8e8' }}
//           bodyStyle={{ padding: '16px' }}
//         >
//           <Form.Item
//             label={
//               <Space size={4}>
//                 <FaRoute size={12} />
//                 <Text strong>Assigned Route</Text>
//                 <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
//               </Space>
//             }
//             required
//             validateStatus={selectedRoute ? 'success' : ''}
//             help={!selectedRoute ? "Please select a route for the dispatcher" : ""}
//           >
//             <Select
//               placeholder="Select a route for assignment"
//               value={selectedRoute}
//               onChange={(value) => setselectedRoute(value)}
//               size="large"
//               style={{ width: '100%', borderRadius: '6px' }}
//               dropdownStyle={{ borderRadius: '6px' }}
//               allowClear
//               suffixIcon={<FaRoute style={{ color: '#bfbfbf' }} />}
//               options={routes.map((r) => ({
//                 label: (
//                   <Space>
//                     <FaRoute style={{ color: '#1890ff' }} />
//                     <Text>{r.StartTerminal} → {r.EndTerminal}</Text>
//                     <Tag color="blue" style={{ marginLeft: 'auto', fontSize: '10px' }}>
//                       ID: {r.id}
//                     </Tag>
//                   </Space>
//                 ),
//                 value: `${r.StartTerminal} → ${r.EndTerminal}`,
//               }))}
//             />
//           </Form.Item>
//         </Card>

//         {/* Form Summary */}
//         {isFormValid && (
//           <Alert
//             message="Ready to Create Dispatcher"
//             description={`Creating account for ${FullName} assigned to ${selectedRoute}`}
//             type="success"
//             showIcon
//             style={{ marginBottom: 24, borderRadius: '8px' }}
//           />
//         )}

//         {/* Action Buttons */}
//         <Space style={{ width: '100%', justifyContent: 'space-between' }}>
//           <Button
//             onClick={handleCancel}
//             size="large"
//             style={{ borderRadius: '6px', padding: '0 24px' }}
//           >
//             Cancel
//           </Button>
          
//           <Button
//             type="primary"
//             loading={loading}
//             onClick={handleCreate}
//             size="large"
//             disabled={!isFormValid}
//             style={{ 
//               borderRadius: '6px', 
//               padding: '0 32px',
//               background: isFormValid ? '#1890ff' : '#d9d9d9',
//               borderColor: isFormValid ? '#1890ff' : '#d9d9d9'
//             }}
//             icon={<FaUserPlus />}
//           >
//             {loading ? 'Creating...' : 'Create Dispatcher'}
//           </Button>
//         </Space>

//         {/* Form Requirements Footer */}
//         <div style={{ 
//           marginTop: 24, 
//           paddingTop: 16, 
//           borderTop: '1px solid #f0f0f0' 
//         }}>
//           <Text type="secondary" style={{ fontSize: '12px' }}>
//             <FaExclamationCircle style={{ marginRight: '4px' }} />
//             All fields are required. Dispatcher will receive login credentials via email.
//           </Text>
//         </div>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateDispachers;


import { Button, Input, message, Modal, Select, Form, Card, Space, Typography, Tag, Alert } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPlus, FaRoute, FaPhoneAlt, FaEnvelope, FaUser, FaExclamationCircle } from "react-icons/fa";

const { Title, Text } = Typography;

type CreateDispachersProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onDispachersCreated?: () => void;
};

type Route = {
  id: number;
  station_name: string;
  EndTerminal: string;
};

const CreateDispachers: React.FC<CreateDispachersProps> = ({ 
  isModalOpen, 
  handleCancel, 
  onDispachersCreated 
}) => {
  const [form] = Form.useForm();
  const [FullName, setFullName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [isFormValid, setIsFormValid] = useState(false);

  // Get token
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/routes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Map the routes to ensure we have station_name
        const mappedRoutes = res.data.map((route: any) => ({
          id: route.id,
          station_name: route.station_name,
          EndTerminal: route.EndTerminal || "Unknown Destination",
          ...route
        }));
        
        setRoutes(mappedRoutes);
      } catch (err: any) {
        console.error("Failed to fetch routes:", err);
        message.error(err.response?.data?.message || "Failed to fetch routes");
      }
    };

    if (isModalOpen) {
      fetchRoutes();
    }
  }, [isModalOpen, token]);

  // Check form validity
  useEffect(() => {
    const isValid = FullName && 
                    Email && 
                    PhoneNumber && 
                    UserName && 
                    selectedRoute &&
                    FullName.trim().length >= 2 &&
                    /^[A-Za-z\s'-]+$/.test(FullName.trim()) &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) &&
                    /^09\d{8}$/.test(PhoneNumber);
    setIsFormValid(!!isValid);
  }, [FullName, Email, PhoneNumber, UserName, selectedRoute]);

  const handleCreate = async () => {
    // Validation
    if (!FullName.trim()) {
      message.warning("Please enter the dispatcher's full name");
      return;
    }

    if (!/^[A-Za-z\s'-]+$/.test(FullName.trim())) {
      message.warning("Name can only contain letters, spaces, apostrophes, and hyphens");
      return;
    }

    if (FullName.trim().length < 2) {
      message.warning("Name should be at least 2 characters long");
      return;
    }

    if (!Email) {
      message.warning("Please enter a valid email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      message.warning("Please enter a valid email address format");
      return;
    }

    if (!PhoneNumber) {
      message.warning("Please enter a phone number");
      return;
    }

    if (!/^09\d{8}$/.test(PhoneNumber)) {
      message.warning("Please enter a valid Ethiopian phone number (09XXXXXXXX)");
      return;
    }

    if (!UserName) {
      message.warning("Please enter a username");
      return;
    }

    if (!selectedRoute) {
      message.warning("Please select an assigned route");
      return;
    }

    if (!token) {
      message.error("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/dispachers",
        { 
          FullName: FullName.trim(), 
          Email: Email.trim().toLowerCase(), 
          PhoneNumber, 
          UserName: UserName.trim(), 
          Routes: selectedRoute, 
          role_id: 3 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success({
        content: res.data.message || "✅ Dispatcher created successfully!",
        duration: 3,
      });
      
      // Reset form
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setUserName("");
      setSelectedRoute(undefined);
      form.resetFields();
      
      handleCancel();
      onDispachersCreated?.(); // refresh data
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to create dispatcher";
      message.error({
        content: errorMessage.includes("Duplicate") 
          ? "Email or phone number already exists" 
          : errorMessage,
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setUserName("");
      setSelectedRoute(undefined);
      form.resetFields();
    }
  }, [isModalOpen, form]);

  // Prepare route options for Select
  const routeOptions = routes.map((route) => ({
    label: (
      <Space>
        <FaRoute style={{ color: '#1890ff' }} />
        <Text>{route.station_name} → {route.EndTerminal}</Text>
        <Tag color="blue" style={{ marginLeft: 'auto', fontSize: '10px' }}>
          ID: {route.id}
        </Tag>
      </Space>
    ),
    value: `${route.station_name} → ${route.EndTerminal}`,
  }));

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      title={
        <Space align="center">
          <div style={{
            backgroundColor: '#1890ff',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUserPlus size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>Create New Dispatcher</Title>
        </Space>
      }
      styles={{
        body: { padding: '24px 0' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: '100%' }}
      >
        <Alert
          message="Enter dispatcher details and assign a route"
          description="All fields are required to create a new dispatcher account"
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        {/* Personal Information Card */}
        <Card
          title={
            <Space>
              <FaUser style={{ color: '#1890ff' }} />
              <Text strong>Personal Information</Text>
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Form.Item
            label={
              <Space size={4}>
                <FaUser size={12} />
                <Text strong>Full Name</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={FullName ? (
              /^[A-Za-z\s'-]+$/.test(FullName.trim()) && FullName.trim().length >= 2
                ? 'success' 
                : 'error'
            )  : ''}
            help={FullName ? (
              !/^[A-Za-z\s'-]+$/.test(FullName.trim()) 
                ? 'Only letters, spaces, apostrophes, and hyphens allowed'
                : FullName.trim().length < 2
                ? 'Minimum 2 characters required'
                : ""
            ) : "Enter dispatcher's full name"}
          >
            <Input
              placeholder="e.g., Abebe Kebede"
              value={FullName}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^A-Za-z\s'-]/g, '');
                setFullName(filtered);
              }}
              onBlur={() => {
                if (FullName.trim()) {
                  const capitalized = FullName
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                  setFullName(capitalized);
                }
              }}
              size="large"
              prefix={<FaUser style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space size={4}>
                <FaEnvelope size={12} />
                <Text strong>Email Address</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={Email ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) ? 'success' : 'error') : ''}
            help={Email ? (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) ? 'Invalid email format' : "") : "Enter valid email address"}
          >
            <Input
              placeholder="abebe.kebede@example.com"
              value={Email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              size="large"
              prefix={<FaEnvelope style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label={
              <Space size={4}>
                <FaPhoneAlt size={12} />
                <Text strong>Phone Number</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={PhoneNumber ? (/^09\d{8}$/.test(PhoneNumber) ? 'success' : 'error') : ''}
            help={PhoneNumber ? (!/^09\d{8}$/.test(PhoneNumber) ? 'Format: 09XXXXXXXX' : "") : "Enter Ethiopian phone number"}
          >
            <Input
              placeholder="0912345678"
              value={PhoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
              size="large"
              prefix={<FaPhoneAlt style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={10}
            />
          </Form.Item>
        </Card>

        {/* Account Information Card */}
        <Card
          title={
            <Space>
              <FaUserPlus style={{ color: '#1890ff' }} />
              <Text strong>Account Information</Text>
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Form.Item
            label={
              <Space size={4}>
                <FaUser size={12} />
                <Text strong>Username</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={UserName ? (UserName.trim().length >= 3 ? 'success' : 'error') : ''}
            help={UserName ? (UserName.trim().length < 3 ? 'Minimum 3 characters' : "") : "Choose a username"}
          >
            <Input
              placeholder="abebe123"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              size="large"
              prefix={<FaUser style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={30}
            />
          </Form.Item>
        </Card>

        {/* Route Assignment Card */}
        <Card
          title={
            <Space>
              <FaRoute style={{ color: '#1890ff' }} />
              <Text strong>Route Assignment</Text>
              {selectedRoute && (
                <Tag color="green" style={{ marginLeft: '8px' }}>Route Selected</Tag>
              )}
            </Space>
          }
          size="small"
          style={{ marginBottom: 32, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Form.Item
            label={
              <Space size={4}>
                <FaRoute size={12} />
                <Text strong>Assigned Route</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={selectedRoute ? 'success' : ''}
            help={!selectedRoute ? "Please select a route for the dispatcher" : ""}
          >
            <Select
              placeholder="Select a route for assignment"
              value={selectedRoute}
              onChange={setSelectedRoute}
              size="large"
              style={{ width: '100%', borderRadius: '6px' }}
              dropdownStyle={{ borderRadius: '6px' }}
              allowClear
              suffixIcon={<FaRoute style={{ color: '#bfbfbf' }} />}
              options={routeOptions}
              loading={routes.length === 0}
            />
          </Form.Item>
        </Card>

        {/* Form Summary */}
        {isFormValid && (
          <Alert
            message="Ready to Create Dispatcher"
            description={`Creating account for ${FullName} assigned to ${selectedRoute}`}
            type="success"
            showIcon
            style={{ marginBottom: 24, borderRadius: '8px' }}
          />
        )}

        {/* Action Buttons */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            onClick={handleCancel}
            size="large"
            style={{ borderRadius: '6px', padding: '0 24px' }}
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            loading={loading}
            onClick={handleCreate}
            size="large"
            disabled={!isFormValid}
            style={{ 
              borderRadius: '6px', 
              padding: '0 32px',
              background: isFormValid ? '#1890ff' : '#d9d9d9',
              borderColor: isFormValid ? '#1890ff' : '#d9d9d9'
            }}
            icon={<FaUserPlus />}
          >
            {loading ? 'Creating...' : 'Create Dispatcher'}
          </Button>
        </Space>

        {/* Form Requirements Footer */}
        <div style={{ 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid #f0f0f0' 
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <FaExclamationCircle style={{ marginRight: '4px' }} />
            All fields are required. Dispatcher will receive login credentials via email.
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateDispachers;