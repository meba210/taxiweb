// import { Modal, Input, Button, message, Select } from "antd";
// import { useState, useEffect } from "react";
// import axios from "axios";

// type StationAdmin = {
//   id: number;
//   FullName: string;
//   Email: string;
//   PhoneNumber: number;
//    UserName: string;
//    Stations:string;
// };

// type Station = {
//    id: number;
//   StationName: string;
// };

// type EditStationAdminModalProps = {
//   isOpen: boolean;
//   handleCancel: () => void;
//   StationAdmin: StationAdmin| null;
//   onUpdated: (updatedStation: StationAdmin) => void;
// };

// const EditStationModal: React.FC<EditStationAdminModalProps> = ({
//   isOpen,
//   handleCancel,
//  StationAdmin,
//   onUpdated,
// }) => {
//   const [FullName, setFullName] = useState("");
//   const [Email, setEmail] = useState("");
//  const [PhoneNumber, setPhoneNumber] = useState<number | undefined>();
//    const [UserName, setUserName] = useState("");
//      const [stations, setStations] = useState<Station[]>([]);
//   const [loading, setLoading] = useState(false);
//    const [selectedStation, setSelectedStation] = useState<string>("");

 
//     const fetchStationadmins = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/stations");
//         setStations(res.data);
//       } catch (err) {
//         console.error("Failed to fetch stations:", err);
//       }
//     };
//      useEffect(() => {
//     fetchStationadmins();
//   }, []);


//   useEffect(() => {
//    if (isOpen && StationAdmin) {
//       setFullName(StationAdmin.FullName);
//      setEmail(StationAdmin.Email);
//       setPhoneNumber(StationAdmin.PhoneNumber);
//       setUserName(StationAdmin.UserName);
//         setSelectedStation(StationAdmin.Stations);
//     }
//   }, [isOpen, StationAdmin]);

// const handleUpdate = async () => {
//   if (!FullName || !Email || !PhoneNumber || !UserName || !selectedStation) {
//     message.warning("Please fill all fields");
//     return;
//   }

//   try {
//     setLoading(true);
//     const res = await axios.put(`http://localhost:5000/stationadmins/${StationAdmin?.id}`, {
//       FullName,
//       Email,
//       PhoneNumber,
//       UserName,
//       Stations: selectedStation, // ID
//     });

//     // Find the name of the selected station
//     const stationName = stations.find((s) => s.id ===  Number(selectedStation))?.StationName || selectedStation;

//     message.success(res.data.message || "✅ Station updated!");
//     onUpdated({
//       ...StationAdmin!,
//       FullName,
//       Email,
//       PhoneNumber,
//       UserName,
//       Stations: stationName, // now display name
//     });

//     handleCancel();
//   } catch (err) {
//     console.error(err);
//     message.error("Failed to update station");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit Station" maskClosable={true}>
//       <div className="space-y-3">
//         <Input placeholder="Full Name" value={FullName} onChange={(e) => setFullName(e.target.value)} />
//         <Input placeholder="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
//         <Input placeholder="Phone Number" value={PhoneNumber} onChange={(e) => setPhoneNumber(Number(e.target.value))} />
//         <Input placeholder="UserName" value={UserName} onChange={(e) => setUserName(e.target.value)} />
//          <Select placeholder="select station"
//             onChange={(value) => setSelectedStation(value)}
//           value={selectedStation}
//           options={stations.map((s) => ({
//             label: s.StationName,
//             value: s.id,
//           }))}
//          />
//         <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
//           Save Changes
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default EditStationModal;


import { Modal, Input, Button, message, Select, Form, Card, Space, Typography, Alert, Divider, Tag } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserEdit, FaUser, FaEnvelope, FaPhoneAlt, FaBuilding, FaExclamationCircle, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

const { Title, Text } = Typography;

type StationAdmin = {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber:  string;
  UserName: string;
  Stations: string;
};

type Station = {
  id: number;
  StationName: string;
};

type EditStationAdminModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  StationAdmin: StationAdmin | null;
  onUpdated: (updatedStation: StationAdmin) => void;
};

const EditStationModal: React.FC<EditStationAdminModalProps> = ({
  isOpen,
  handleCancel,
  StationAdmin,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState<string>("");
  const [UserName, setUserName] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState<StationAdmin | null>(null);

  const fetchStationadmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/stations");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      message.error("Failed to load stations");
    }
  };

  useEffect(() => {
    fetchStationadmins();
  }, []);

  useEffect(() => {
    if (isOpen && StationAdmin) {
      setFullName(StationAdmin.FullName);
      setEmail(StationAdmin.Email);
     setPhoneNumber(String(StationAdmin.PhoneNumber));
      setUserName(StationAdmin.UserName);
      
      // Find station ID from station name
      const station = stations.find(s => s.StationName === StationAdmin.Stations);
      setSelectedStation(station ? station.id.toString() : "");
      
      setOriginalAdmin(StationAdmin);
      
      form.setFieldsValue({
        FullName: StationAdmin.FullName,
        Email: StationAdmin.Email,
        PhoneNumber: StationAdmin.PhoneNumber,
        UserName: StationAdmin.UserName,
        Stations: station ? station.id : "",
      });
    }
  }, [isOpen, StationAdmin, stations]);

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
                    (/^09\d{8}$/.test(PhoneNumber.toString()) || /^\+2519\d{9}$/.test(PhoneNumber.toString()));
    setIsFormValid(!!isValid);
  }, [FullName, Email, PhoneNumber, UserName, selectedStation]);

  const handleUpdate = async () => {
    // Enhanced validation with specific messages
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

    // Ethiopian phone number validation
    const phoneStr = PhoneNumber.toString();
    if (!(/^09\d{8}$/.test(phoneStr) || /^\+2519\d{9}$/.test(phoneStr))) {
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
      const res = await axios.put(`http://localhost:5000/stationadmins/${StationAdmin?.id}`, {
        FullName,
        Email,
        PhoneNumber,
        UserName,
        Stations: selectedStation,
      });

      // Find the name of the selected station
      const stationName = stations.find((s) => s.id === Number(selectedStation))?.StationName || selectedStation;

      message.success({
        content: res.data.message || "✅ Station Admin updated successfully!",
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });
      
      onUpdated({
        ...StationAdmin!,
        FullName,
        Email,
        PhoneNumber,
        UserName,
        Stations: stationName,
      });

      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Failed to update station admin",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalAdmin) return false;
    return FullName.trim() !== originalAdmin.FullName || 
           Email.trim() !== originalAdmin.Email || 
           PhoneNumber !== originalAdmin.PhoneNumber || 
           UserName.trim() !== originalAdmin.UserName || 
           selectedStation !== originalAdmin.Stations;
  };

  const selectedStationName = selectedStation 
    ? stations.find(s => s.id === Number(selectedStation))?.StationName 
    : null;

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
            backgroundColor: '#722ed1',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaUserShield size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>Edit Station Admin</Title>
          {StationAdmin && (
            <Tag color="purple" style={{ marginLeft: 8 }}>ID: {StationAdmin.id}</Tag>
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
          message="Update station administrator information"
          description={StationAdmin ? `Editing ${StationAdmin.FullName}'s details` : "Loading admin information..."}
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
                      : originalAdmin && FullName.trim() !== originalAdmin.FullName
                      ? <Space size={4}><FaExclamationCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalAdmin.FullName}"</Text></Space>
                      : ""
                  ) 
                  : "Required field"
            }
          >
            <Input
              placeholder="John Doe"
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
                      : originalAdmin && Email.trim() !== originalAdmin.Email
                      ? <Space size={4}><FaExclamationCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalAdmin.Email}"</Text></Space>
                      : ""
                  ) 
                : "Required field"
            }
          >
            <Input
              placeholder="john.doe@example.com"
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
            help={
              UserName 
                ? (
                    originalAdmin && UserName.trim() !== originalAdmin.UserName
                      ? <Space size={4}><FaExclamationCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalAdmin.UserName}"</Text></Space>
                      : ""
                  ) 
                : "Required field"
            }
          >
            <Input
              placeholder="johndoe123"
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

        {/* Station Assignment Card */}
        <Card
          title={
            <Space>
              <FaBuilding style={{ color: '#722ed1' }} />
              <Text strong>Station Assignment</Text>
              {selectedStationName && (
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
                <FaBuilding size={12} />
                <Text strong>Assigned Station</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={selectedStation ? 'success' : ''}
            help={
              !selectedStation 
                ? "Select a station for the admin" 
                : originalAdmin && selectedStation !== originalAdmin.Stations
                ? <Space size={4}><FaExclamationCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalAdmin.Stations}"</Text></Space>
                : ""
            }
          >
            <Select
              placeholder="Select a station"
              value={selectedStation || undefined}
              onChange={(value) => setSelectedStation(value)}
              size="large"
              style={{ width: '100%', borderRadius: '6px' }}
              dropdownStyle={{ borderRadius: '6px' }}
              suffixIcon={<FaBuilding style={{ color: '#bfbfbf' }} />}
              showSearch
              
              options={stations.map((s) => ({
                label: (
                  <Space>
                    <FaBuilding style={{ color: '#722ed1' }} />
                    <Text>{s.StationName}</Text>
                    <Tag color="purple" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                      ID: {s.id}
                    </Tag>
                  </Space>
                ),
                value: s.id.toString(),
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
        {originalAdmin && hasChanges() && (
          <Card
            size="small"
            style={{ 
              marginBottom: 24, 
              borderColor: '#b7eb8f',
              backgroundColor: '#f6ffed'
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text strong style={{ color: '#389e0d' }}>Changes Summary</Text>
              <Space align="start">
                <FaUserShield style={{ color: '#722ed1', marginTop: '2px' }} />
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Original Admin</Text>
                  <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                    {originalAdmin.FullName} ({originalAdmin.UserName})
                  </Text>
                  <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    {originalAdmin.Email} • {originalAdmin.PhoneNumber}
                  </Text>
                  <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    Station: <Tag color="purple" style={{ fontSize: '10px' }}>{originalAdmin.Stations}</Tag>
                  </Text>
                </div>
              </Space>
            </Space>
          </Card>
        )}

        {isFormValid && selectedStationName && (
          <Alert
            message="Ready to Update"
            description={`Updating station admin ${FullName} assigned to ${selectedStationName}`}
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
            disabled={!isFormValid || !hasChanges()}
            style={{ 
              borderRadius: '6px', 
              padding: '0 32px',
              background: (isFormValid && hasChanges()) ? '#722ed1' : '#d9d9d9',
              borderColor: (isFormValid && hasChanges()) ? '#722ed1' : '#d9d9d9'
            }}
            icon={<FaUserShield />}
          >
            {loading ? 'Updating...' : 'Update Station Admin'}
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
            Station Admin ID: {StationAdmin?.id} • Admin permissions will be updated for the assigned station
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default EditStationModal;