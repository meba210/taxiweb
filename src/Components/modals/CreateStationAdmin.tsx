// import {  Button, Input, message, Modal, Select,  } from "antd";
// import axios from "axios";
// import { useEffect, useState } from "react";

// type CreateStationAdminProps = {
//    isModalOpen: boolean;
//   handleCancel: () => void;
//    onStationAdminCreated?: () => void;
// };
// type Station = {
//   id:number,
//   StationName: string;
// };
// const CreateStationAdmin:  React.FC <CreateStationAdminProps>= ({isModalOpen, handleCancel,onStationAdminCreated}) => {
     
//     const [FullName, setFullName] = useState("");
//       const [PhoneNumber, setPhoneNumber] = useState("");
//       const [Email, setEmail] = useState("");
//       const [UserName, setUserName] = useState("");
//     const [stations, setStations] = useState<Station[]>([]);
//       const [loading, setLoading] = useState(false);
//       const [selectedStation, setSelectedStation] = useState<number | undefined>();


//        useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/stations");
//         setStations(res.data);
//       } catch (err) {
//         console.error("Failed to fetch stations:", err);
//       }
//     };

//     fetchStations();
//   }, []);

//         const handleCreate = async () => {
//     if (!FullName || !Email || !PhoneNumber || !UserName || !selectedStation) {
//       message.warning("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:5000/stationadmins",
//         { FullName, Email, PhoneNumber,UserName,selectedStation,role_id: 2},
//         { withCredentials: true }
//       );

//      alert(res.data.message || "✅ Station created successfully!");
//       handleCancel(); 
//       onStationAdminCreated?.(); // refresh data
//     } catch (err: any) {
//       console.error(err);
//        alert(err.response?.data?.message || "Failed to create station");
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
//          <Select placeholder="select station"
//            onChange={(value) => setSelectedStation(value)}
//               value={selectedStation}
//          options={stations.map((s) => ({ label: s.StationName,value: s.id, }))}
//          />
//           <Button
//           type="primary"
//           loading={loading}
//           onClick={handleCreate}
//           className="bg-blue-500 hover:bg-blue-600 w-full rounded-md"
//         >
//           Create Admin
//         </Button>
//     </div>
// </Modal>
// );

// }; export default CreateStationAdmin


import { Button, Input, message, Modal, Select, Form, Card, Space, Typography, Tag, Alert, Grid } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPlus, FaUser, FaPhoneAlt, FaEnvelope, FaBuilding, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type CreateStationAdminProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
  onStationAdminCreated?: () => void;
};

type Station = {
 // id: number;
  StationName: string;
};

const CreateStationAdmin: React.FC<CreateStationAdminProps> = ({ 
  isModalOpen, 
  handleCancel, 
  onStationAdminCreated 
}) => {
  const [form] = Form.useForm();
  const [FullName, setFullName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [isFormValid, setIsFormValid] = useState(false);
  
  const screens = useBreakpoint();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/stations");
        setStations(res.data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
        message.error("Failed to load stations");
      }
    };

    if (isModalOpen) {
      fetchStations();
    }
  }, [isModalOpen]);

  // Check form validity
  useEffect(() => {
    const isValid = FullName && 
                    Email && 
                    PhoneNumber && 
                    UserName && 
                    selectedStation &&
                    FullName.trim().length >= 2 &&
                    /^[A-Za-z\s'-]+$/.test(FullName.trim()) &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email) &&
                    (/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')) || /^\+2519\d{9}$/.test(PhoneNumber.replace(/\s/g, '')));
    setIsFormValid(!!isValid);
  }, [FullName, Email, PhoneNumber, UserName, selectedStation]);

  const handleCreate = async () => {
    if (!FullName.trim()) {
      message.warning("Please enter the admin's full name");
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

    if (!(/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')) || /^\+2519\d{9}$/.test(PhoneNumber.replace(/\s/g, '')))) {
      message.warning("Please enter a valid Ethiopian phone number (09XXXXXXXXX or +2519XXXXXXXXX)");
      return;
    }

    if (!UserName) {
      message.warning("Please enter a username");
      return;
    }

    if (!selectedStation) {
      message.warning("Please select a station");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/stationadmins",
        { 
          FullName: FullName.trim(),
          Email: Email.trim(),
          PhoneNumber: PhoneNumber.trim(),
          UserName: UserName.trim(),
          selectedStation,
          role_id: 2 
        },
        { withCredentials: true }
      );

      message.success({
        content: res.data.message || "✅ Station Admin created successfully!",
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setUserName("");
      setSelectedStation(undefined);
      form.resetFields();
      
      handleCancel();
      onStationAdminCreated?.();
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Failed to create station admin",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setUserName("");
      setSelectedStation(undefined);
      form.resetFields();
    }
  }, [isModalOpen]);

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

  const selectedStationName = selectedStation 
    ? stations.find(s => s.StationName === selectedStation)?.StationName 
    : null;

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={screens.lg ? 600 : screens.md ? 500 : 400}
      centered
      title={
        <Space align="center" size={screens.xs ? "small" : "middle"}>
          <div style={{
            backgroundColor: '#722ed1',
            borderRadius: '8px',
            padding: screens.xs ? '6px' : '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MdAdminPanelSettings size={screens.xs ? 16 : 20} color="#fff" />
          </div>
          <Title level={screens.xs ? 5 : 4} style={{ margin: 0 }}>Create Station Admin</Title>
        </Space>
      }
      styles={{
        body: { padding: screens.xs ? '16px 0' : '24px 0' },
        header: { borderBottom: '1px solid #f0f0f0', padding: screens.xs ? '12px 16px' : '16px 24px' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: '100%' }}
      >
        <Alert
          message="Create a new station administrator account"
          description={screens.xs ? undefined : "Station admins manage specific station operations and users"}
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: screens.xs ? 16 : 24, borderRadius: '8px' }}
        />

        {/* Personal Information Card */}
        <Card
          title={
            <Space>
              <FaUser style={{ color: '#1890ff' }} />
              <Text strong>{screens.xs ? "Personal Info" : "Personal Information"}</Text>
            </Space>
          }
          size="small"
          style={{ marginBottom: screens.xs ? 16 : 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
        >
          <Form.Item
            label={
              <Space size={4}>
                <FaUser size={12} />
                <Text strong>Full Name</Text>
              </Space>
            }
            required
            validateStatus={FullName ? (
              /^[A-Za-z\s]+$/.test(FullName.trim()) && FullName.trim().length >= 2
                ? 'success' 
                : 'error'
            ) : ''}
            help={FullName ? (!/^[A-Za-z\s]+$/.test(FullName.trim()) && FullName.trim().length >= 2 ? 'Invalid full name' : "") : "Required field"}
          >
            <Input
              placeholder="Abebe"
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
              size={screens.xs ? "middle" : "large"}
              prefix={<FaUser style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
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
              placeholder="abe@example.com"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              size={screens.xs ? "middle" : "large"}
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
                ? (
                    (/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')))
                      ? 'success' 
                      : 'error'
                  ) 
                : ''
            }
            help={
              PhoneNumber 
                ? (
                    !(/^09\d{8}$/.test(PhoneNumber.replace(/\s/g, '')))
                      ? 'Use 09XXXXXXXXX'
                      : ""
                  ) 
                : "Required field"
            }
          >
            <Input
              placeholder="09XXXXXXXXX"
              value={PhoneNumber}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                setPhoneNumber(formatted);
              }}
              size={screens.xs ? "middle" : "large"}
              prefix={
                <Space size={4}>
                  <FaPhoneAlt style={{ color: '#bfbfbf' }} />
                </Space>
              }
              style={{ borderRadius: '6px' }}
              allowClear
            />
          </Form.Item>
        </Card>

        {/* Account Information Card */}
        <Card
          title={
            <Space>
              <FaUserPlus style={{ color: '#1890ff' }} />
              <Text strong>{screens.xs ? "Account Info" : "Account Information"}</Text>
            </Space>
          }
          size="small"
          style={{ marginBottom: screens.xs ? 16 : 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
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
              placeholder="johndoe123"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              size={screens.xs ? "middle" : "large"}
              prefix={<FaUser style={{ color: '#bfbfbf' }} />}
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={30}
            />
          </Form.Item>
        </Card>

        {/* Station Assignment Card */}
        <Card
          title={
            <Space>
              <FaBuilding style={{ color: '#1890ff' }} />
              <Text strong>{screens.xs ? "Station" : "Station Assignment"}</Text>
              {selectedStation && (
                <Tag color="green" style={{ marginLeft: screens.xs ? '4px' : '8px', fontSize: screens.xs ? '10px' : '12px' }}>Selected</Tag>
              )}
            </Space>
          }
          size="small"
          style={{ marginBottom: screens.xs ? 24 : 32, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: screens.xs ? '12px' : '16px' }}
        >
          <Form.Item
            label={
              <Space size={4} wrap>
                <FaBuilding size={12} />
                <Text strong>{screens.xs ? "Station" : "Assigned Station"}</Text>
                <Tag color="red" style={{ fontSize: screens.xs ? '9px' : '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={selectedStation ? 'success' : ''}
            help={!selectedStation ? "Select a station for the admin" : ""}
          >
            <Select
              placeholder="Select a station"
              value={selectedStation}
              onChange={(value) => setSelectedStation(value)}
              size={screens.xs ? "middle" : "large"}
              style={{ width: '100%', borderRadius: '6px' }}
              dropdownStyle={{ borderRadius: '6px' }}
              suffixIcon={<FaBuilding style={{ color: '#bfbfbf' }} />}
              showSearch
              options={stations.map((s) => ({
                label: (
                  <Space>
                    <FaBuilding style={{ color: '#722ed1' }} />
                    <Text>{screens.xs ? (s.StationName.length > 15 ? s.StationName.substring(0, 15) + '...' : s.StationName) : s.StationName}</Text>
                  
                  </Space>
                ),
                value: s.StationName,
              }))}
              notFoundContent={
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <FaBuilding style={{ fontSize: '24px', color: '#d9d9d9', marginBottom: '8px' }} />
                  <Text type="secondary">No stations found</Text>
                </div>
              }
            />
          </Form.Item>
        </Card>

        {/* Admin Summary */}
        {isFormValid && selectedStationName && (
          <Card
            size="small"
            style={{ 
              marginBottom: screens.xs ? 16 : 24, 
              borderColor: '#b7eb8f',
              backgroundColor: '#f6ffed'
            }}
            bodyStyle={{ padding: screens.xs ? '8px 12px' : '12px 16px' }}
          >
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text strong style={{ color: '#389e0d', fontSize: screens.xs ? '13px' : '14px' }}>Admin Summary</Text>
              <Space wrap>
                <Text type="secondary">Name:</Text>
                <Text strong style={{ fontSize: screens.xs ? '13px' : '14px' }}>{FullName.trim()}</Text>
              </Space>
              <Space wrap>
                <Text type="secondary">Username:</Text>
                <Text strong style={{ fontSize: screens.xs ? '13px' : '14px' }}>{UserName.trim()}</Text>
              </Space>
              <Space wrap>
                <Text type="secondary">Station:</Text>
                <Tag color="purple" style={{ fontSize: screens.xs ? '10px' : '12px' }}>
                  {screens.xs && selectedStationName.length > 15 
                    ? selectedStationName.substring(0, 15) + '...' 
                    : selectedStationName}
                </Tag>
              </Space>
              <Space wrap>
                <Text type="secondary">Role:</Text>
                <Tag color="volcano" style={{ fontSize: screens.xs ? '10px' : '12px' }}>Station Admin</Tag>
              </Space>
            </Space>
          </Card>
        )}


        {/* Action Buttons */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap={screens.xs}>
          <Button
            onClick={handleCancel}
            size={screens.xs ? "middle" : "large"}
            style={{ 
              borderRadius: '6px', 
              padding: screens.xs ? '0 16px' : '0 24px',
              marginBottom: screens.xs ? '8px' : 0
            }}
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            loading={loading}
            onClick={handleCreate}
            size={screens.xs ? "middle" : "large"}
            disabled={!isFormValid}
            style={{ 
              borderRadius: '6px', 
              padding: screens.xs ? '0 24px' : '0 32px',
              background: isFormValid ? '#722ed1' : '#d9d9d9',
              borderColor: isFormValid ? '#722ed1' : '#d9d9d9'
            }}
            icon={!screens.xs && <MdAdminPanelSettings />}
          >
            {loading ? 'Creating...' : (screens.xs ? 'Create Admin' : 'Create Station Admin')}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default CreateStationAdmin;