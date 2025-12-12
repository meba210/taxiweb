// import { Modal, Input, Button, message, Select } from "antd";
// import { useState, useEffect } from "react";
// import axios from "axios";

// type Dispacher = {
//   id: number;
//   FullName: string;
//   Email: string;
//   PhoneNumber: number;
//    UserName: string;
//    Routes:string;
// };

// type Route = {
//   id:number,
//  StartTerminal: string;
//  EndTerminal:string;
// };

// type EditDispachersModalProps = {
//   isOpen: boolean;
//   handleCancel: () => void;
//   Dispacher:  Dispacher| null;
//   onUpdated: (updatedDispacher: Dispacher) => void;
// };

// const EditDispachersModal: React.FC<EditDispachersModalProps> = ({
//   isOpen,
//   handleCancel,
//  Dispacher,
//   onUpdated,
// }) => {
//   const [FullName, setFullName] = useState("");
//   const [Email, setEmail] = useState("");
//  const [PhoneNumber, setPhoneNumber] = useState<number | undefined>();
//    const [UserName, setUserName] = useState("");
//      const [routes, setRoutes] = useState<Route[]>([]);
//   const [loading, setLoading] = useState(false);
//    const [selectedRoute, setSelectedRoute] = useState<string>("");

 
//     const fetchDispachers= async () => {
//  const token = localStorage.getItem("token");
//       if (!token) {
//       message.error("No token found. Please login again.");
//       return;
//     }
//       try {
//          const res = await axios.get("http://localhost:5000/routes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//         setRoutes(res.data);
//       } catch (err:any) {
//         console.error("Failed to fetch routes:", err);
//          message.error(err.response?.data?.message || "Failed to fetch routes");
//       }
//     };
//      useEffect(() => {
//     fetchDispachers();
//   }, []);


//   useEffect(() => {
//    if (isOpen && Dispacher) {
//       setFullName(Dispacher.FullName);
//      setEmail(Dispacher.Email);
//       setPhoneNumber(Dispacher.PhoneNumber);
//       setUserName(Dispacher.UserName);
//         setSelectedRoute(Dispacher.Routes);
//     }
//   }, [isOpen, Dispacher]);

//   const handleUpdate = async () => {
//     if (!FullName|| !Email || !PhoneNumber||!UserName||!selectedRoute) {
//       message.warning("Please fill all fields");
//       return;
//     }

// const token = localStorage.getItem("token");
//     if (!token) {
//       message.error("No token found. Please login again.");
//       return;
//     }

//     try {

      

//       setLoading(true);
//       const res = await axios.put(`http://localhost:5000/dispachers/${Dispacher?.id}`, {
//         FullName,
//          Email,
//          PhoneNumber,
//          UserName,
//             Routes:selectedRoute,
//       },
//     {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//     );
    
// //     const routeObj = routes.find((r) => r.id === Number(selectedRoute));

// // const Route = routeObj
// //   ? `${routeObj.StartTerminal} → ${routeObj.EndTerminal}`
// //   : selectedRoute;

//       message.success(res.data.message || "✅ Station updated!");
//       onUpdated({ ...Dispacher!, FullName: FullName, Email: Email, PhoneNumber: PhoneNumber, UserName: UserName,Routes: selectedRoute,});
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to update route");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit route" maskClosable={true}>
//       <div className="space-y-3">
//         <Input placeholder="Full Name" value={FullName} onChange={(e) => setFullName(e.target.value)} />
//         <Input placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
//         <Input placeholder="Phone Number" value={PhoneNumber} onChange={(e) => setPhoneNumber(Number(e.target.value))} />
//         <Input placeholder="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} />
//            <Select placeholder="select Route"
//            onChange={(value) => setSelectedRoute(value)}
//               value={selectedRoute}
//          options={routes.map((r) => ({
//     label: `${r.StartTerminal} → ${r.EndTerminal}`,  value: `${r.StartTerminal} → ${r.EndTerminal}`}))}
//          />
//         <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
//           Save Changes
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default EditDispachersModal;


import { Modal, Input, Button, message, Select, Form, Card, Space, Typography, Alert, Divider, Tag } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserEdit, FaUser, FaEnvelope, FaPhoneAlt, FaRoute, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

const { Title, Text } = Typography;

type Dispacher = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber:  string;
  UserName: string;
  Routes: string;
};

type Route = {
  id: number;
  StartTerminal: string;
  EndTerminal: string;
};

type EditDispachersModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  Dispacher: Dispacher | null;
  onUpdated: (updatedDispacher: Dispacher) => void;
};

const EditDispachersModal: React.FC<EditDispachersModalProps> = ({
  isOpen,
  handleCancel,
  Dispacher,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
 const [PhoneNumber, setPhoneNumber] = useState<string>("");

  const [UserName, setUserName] = useState("");
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  const fetchDispachers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No token found. Please login again.");
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
    } catch (err: any) {
      console.error("Failed to fetch routes:", err);
      message.error(err.response?.data?.message || "Failed to fetch routes");
    }
  };

  useEffect(() => {
    fetchDispachers();
  }, []);

  useEffect(() => {
    if (isOpen && Dispacher) {
      setFullName(Dispacher.FullName);
      setEmail(Dispacher.Email);
      setPhoneNumber(String(Dispacher.PhoneNumber));

      setUserName(Dispacher.UserName);
      setSelectedRoute(Dispacher.Routes);
      form.setFieldsValue({
        FullName: Dispacher.FullName,
        Email: Dispacher.Email,
        PhoneNumber: Dispacher.PhoneNumber,
        UserName: Dispacher.UserName,
        Routes: Dispacher.Routes,
      });
    }
  }, [isOpen, Dispacher]);

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
                    (/^09\d{8}$/.test(PhoneNumber.toString()));
    setIsFormValid(!!isValid);
  }, [FullName, Email, PhoneNumber, UserName, selectedRoute]);

  const handleUpdate = async () => {
    // Enhanced validation with specific messages
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

   
    const phoneStr = PhoneNumber.toString();
    if (!(/^09\d{8}$/.test(phoneStr) || /^\+2519\d{9}$/.test(phoneStr))) {
      message.warning("Please enter a valid phone number (09XXXXXXXX)");
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

    const token = localStorage.getItem("token");
    if (!token) {
      message.error("No token found. Please login again.");
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
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success({
        content: res.data.message || "✅ Dispatcher updated successfully!",
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });
      
      onUpdated({ 
        ...Dispacher!, 
        FullName: FullName, 
        Email: Email, 
        PhoneNumber: PhoneNumber, 
        UserName: UserName, 
        Routes: selectedRoute 
      });
      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Failed to update dispatcher",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('09') && cleaned.length <= 10) {
      return cleaned;
    } else if (cleaned.startsWith('+2519') && cleaned.length <= 13) {
      return cleaned;
    } else if (cleaned.startsWith('2519') && cleaned.length <= 12) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('9') && !cleaned.startsWith('09') && cleaned.length <= 9) {
      return `0${cleaned}`;
    }
    
    return cleaned;
  };

  return (
    <Modal
      open={isOpen}
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
            <FaUserEdit size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>Edit Dispatcher</Title>
          {Dispacher && (
            <Tag color="blue" style={{ marginLeft: 8 }}>ID: {Dispacher.id}</Tag>
          )}
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
          message="Update dispatcher information"
          description={Dispacher ? `Editing ${Dispacher.FullName}'s details` : "Loading dispatcher information..."}
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
              </Space>
            }
            required
            validateStatus={
              FullName 
                ? (
                    /^[A-Za-z\s'-]+$/.test(FullName.trim()) && FullName.trim().length >= 2
                      ? 'success' 
                      : 'error'
                  ) 
                : ''
            }
            help={
              FullName 
                ? (
                    !/^[A-Za-z\s'-]+$/.test(FullName.trim())
                      ? 'Only letters, spaces, apostrophes (\'), and hyphens (-) allowed'
                      : FullName.trim().length < 2
                      ? 'Name should be at least 2 characters long'
                      : ""
                  ) 
                  : "Required field"
            }
          >
            <Input
              placeholder="Abebe"
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
              </Space>
            }
            required
            validateStatus={
              Email 
                ? (
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)
                      ? 'success' 
                      : 'error'
                  ) 
                : ''
            }
            help={
              Email 
                ? (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)
                      ? 'Invalid email format'
                      : ""
                  ) 
                : "Required field"
            }
          >
            <Input
              placeholder="Abe@example.com"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
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
    </Space>
  }
  required
  validateStatus={
    PhoneNumber
      ? (/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, "")))
        ? "success"
        : "error"
      : ""
  }
  help={
    PhoneNumber
      ? (!(/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, "")))
          ? "Phone must be 09XXXXXXXX"
          : "")
      : "Required field"
  }
>
  <Input
    placeholder="09XXXXXXXX"
    value={PhoneNumber}
    onChange={(e) => {
      const raw = e.target.value.replace(/\s/g, "");

      // Only allow digits and + sign
      const cleaned = raw.replace(/[^0-9+]/g, "");

      setPhoneNumber(cleaned);
    }}
    size="large"
    style={{ borderRadius: "6px" }}
    allowClear
  />
</Form.Item>


        </Card>

        {/* Account Information Card */}
        <Card
          title={
            <Space>
              <MdDriveFileRenameOutline style={{ color: '#1890ff' }} />
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
              </Space>
            }
            required
            validateStatus={UserName ? 'success' : ''}
            help={!UserName ? "Required field" : ""}
          >
            <Input
              placeholder="abe123"
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
                <Tag color="green" style={{ marginLeft: '8px' }}>Selected</Tag>
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
            help={!selectedRoute ? "Select a route for the dispatcher" : ""}
          >
            <Select
              placeholder="Select a route"
              value={selectedRoute}
              onChange={(value) => setSelectedRoute(value)}
              size="large"
              style={{ width: '100%', borderRadius: '6px' }}
              dropdownStyle={{ borderRadius: '6px' }}
              suffixIcon={<FaRoute style={{ color: '#bfbfbf' }} />}
              options={routes.map((r) => ({
                label: (
                  <Space>
                    <FaRoute style={{ color: '#1890ff' }} />
                    <Text>{r.StartTerminal} → {r.EndTerminal}</Text>
                    <Tag color="blue" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                      ID: {r.id}
                    </Tag>
                  </Space>
                ),
                value: `${r.StartTerminal} → ${r.EndTerminal}`,
              }))}
            />
          </Form.Item>
        </Card>

        {/* Update Summary */}
        {Dispacher && (
          <Card
            size="small"
            style={{ 
              marginBottom: 24, 
              borderColor: '#d6e4ff',
              backgroundColor: '#f0f7ff'
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text strong style={{ color: '#1890ff' }}>Current Information</Text>
              <Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>Name:</Text>
                <Text style={{ fontSize: '12px' }}>{Dispacher.FullName}</Text>
              </Space>
              <Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>Route:</Text>
                <Text style={{ fontSize: '12px' }}>{Dispacher.Routes}</Text>
              </Space>
            </Space>
          </Card>
        )}

        {isFormValid && (
          <Alert
            message="Ready to Update"
            description={`Updating information for ${FullName}`}
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
            onClick={handleUpdate}
            size="large"
            disabled={!isFormValid}
            style={{ 
              borderRadius: '6px', 
              padding: '0 32px',
              background: isFormValid ? '#1890ff' : '#d9d9d9',
              borderColor: isFormValid ? '#1890ff' : '#d9d9d9'
            }}
            icon={<FaUserEdit />}
          >
            {loading ? 'Updating...' : 'Update Dispatcher'}
          </Button>
        </Space>

        {/* Footer Note */}
        <div style={{ 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid #f0f0f0' 
        }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <FaExclamationCircle style={{ marginRight: '4px' }} />
            Dispatcher ID: {Dispacher?.id} • Last updated information will replace existing data
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default EditDispachersModal;