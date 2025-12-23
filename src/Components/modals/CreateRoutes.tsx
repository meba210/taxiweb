// import { Button, Input, message, Modal } from "antd";
// import axios from "axios";
// import { useState } from "react";

// type CreateRoutesProps = {
//   isModalOpen: boolean;
//   handleCancel: () => void;
//   onRoutesCreated?: () => void;
// };

// const CreateRoutes: React.FC<CreateRoutesProps> = ({
//   isModalOpen,
//   handleCancel,
//   onRoutesCreated,
// }) => {
//   const [StartTerminal, setStartTerminal] = useState("");
//   const [EndTerminal, setEndTerminal] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreate = async () => {
//     if (!StartTerminal || !EndTerminal) {
//       message.warning("Please fill in all fields");
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
//         "http://localhost:5000/routes",
//         { StartTerminal, EndTerminal },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Create route response:", res.data);
//       message.success(res.data.message || "Route created successfully!");

//       onRoutesCreated?.(); // Refresh routes in parent
//       handleCancel();
//     } catch (err: any) {
//       console.error("Create route error:", err.response?.data || err);
//       message.error(err.response?.data?.message || "Failed to create route");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal title="Create New Route" open={isModalOpen} onCancel={handleCancel} footer={null}>
//       <div className="space-y-4">
//         <Input
//           placeholder="Insert Start Terminal"
//           value={StartTerminal}
//           onChange={(e) => setStartTerminal(e.target.value)}
//         />
//         <Input
//           placeholder="Insert End Terminal"
//           value={EndTerminal}
//           onChange={(e) => setEndTerminal(e.target.value)}
//         />
//         <Button type="primary" loading={loading} onClick={handleCreate} className="w-full">
//           Create Route
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default CreateRoutes;


import { Button, Input, message, Modal, Form, Card, Space, Typography, Alert, Divider, Tag } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaRoute, FaMapMarkerAlt, FaMapPin, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";

const { Title, Text } = Typography;

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
  const [form] = Form.useForm();
  const [StartTerminal, setStartTerminal] = useState("");
  const [EndTerminal, setEndTerminal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity
  useEffect(() => {
    const isValid =  EndTerminal && 
                    //StartTerminal.trim().length >= 2 && 
                    EndTerminal.trim().length >= 2 
                    //StartTerminal.trim().toLowerCase() !== EndTerminal.trim().toLowerCase();
    setIsFormValid(!!isValid);
  }, [EndTerminal]);

  const handleCreate = async () => {
    // Enhanced validation with specific messages
    // if (!StartTerminal.trim()) {
    //   message.warning("Please enter the start terminal name");
    //   return;
    // }
    
    // if (StartTerminal.trim().length < 2) {
    //   message.warning("Start terminal should be at least 2 characters long");
    //   return;
    // }

    if (!EndTerminal.trim()) {
      message.warning("Please enter the end terminal name");
      return;
    }

    if (EndTerminal.trim().length < 2) {
      message.warning("End terminal should be at least 2 characters long");
      return;
    }

    // if (StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase()) {
    //   message.warning("Start and end terminals cannot be the same");
    //   return;
    // }

    const token = localStorage.getItem("token");
    if (!token) {
      message.error({
        content: "No token found. Please login again.",
        duration: 3,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/routes",
        { 
         // StartTerminal: StartTerminal.trim(),
          EndTerminal: EndTerminal.trim() 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Create route response:", res.data);
      
      message.success({
        content: res.data.message || "✅ Route created successfully!",
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });

    
      //setStartTerminal("");
      setEndTerminal("");
      form.resetFields();
      
      onRoutesCreated?.(); 
      handleCancel();
    } catch (err: any) {
      console.error("Create route error:", err.response?.data || err);
      message.error({
        content: err.response?.data?.message || "Failed to create route",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!isModalOpen) {
      //setStartTerminal("");
      setEndTerminal("");
      form.resetFields();
    }
  }, [isModalOpen]);

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
            backgroundColor: '#52c41a',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaRoute size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>Create New Route</Title>
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
          message="Define a new transportation route"
          description="Enter the start and end terminals to create a new route"
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        
        <Card
          title={
            <Space>
              <GiPathDistance style={{ color: '#52c41a' }} />
              <Text strong>Route Information</Text>
              {isFormValid && (
                <Tag color="green" style={{ marginLeft: '8px' }}>Valid Route</Tag>
              )}
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          {/* Start Terminal */}
          {/* <Form.Item
            label={
              <Space size={4}>
                <FaMapMarkerAlt size={12} />
                <Text strong>Start Terminal</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={
              StartTerminal 
                ? (
                    StartTerminal.trim().length >= 2
                      ? 'success' 
                      : 'error'
                  ) 
                : ''
            }
            help={
              StartTerminal 
                ? (
                    StartTerminal.trim().length < 2
                      ? 'Terminal name should be at least 2 characters long'
                      : StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase()
                      ? 'Start and end terminals cannot be the same'
                      : ""
                  ) 
                : "Enter the starting point of the route"
            }
          >
            <Input
              placeholder="e.g., Bole Airport, Merkato, Meskel Square"
              value={StartTerminal}
              onChange={(e) => {
                // Allow letters, numbers, spaces, and common punctuation
                const value = e.target.value.replace(/[^A-Za-z0-9\s.,'-]/g, '');
                // Limit to 50 characters
                const limited = value.substring(0, 50);
                setStartTerminal(limited);
              }}
              size="large"
              prefix={
                <Space size={4}>
                  <FaMapMarkerAlt style={{ color: '#bfbfbf' }} />
                  {StartTerminal && StartTerminal.trim().length >= 2 && (
                    <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px', height: '16px' }}>
                      START
                    </Tag>
                  )}
                </Space>
              }
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={50}
              onBlur={() => {
                // Capitalize first letter of each word
                if (StartTerminal.trim()) {
                  const capitalized = StartTerminal
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                  setStartTerminal(capitalized);
                }
              }}
            />
          </Form.Item>

          <Divider>
            <FaRoute style={{ color: '#d9d9d9', margin: '0 8px' }} />
            <Text type="secondary">to</Text>
          </Divider> */}

          {/* End Terminal */}
          <Form.Item
            label={
              <Space size={4}>
                <FaMapPin size={12} />
                <Text strong>End Terminal</Text>
                <Tag color="red" style={{ fontSize: '10px' }}>Required</Tag>
              </Space>
            }
            required
            validateStatus={
              EndTerminal 
                ? (
                    EndTerminal.trim().length >= 2
                      ? 'success' 
                      : 'error'
                  ) 
                : ''
            }
            help={
              EndTerminal 
                ? (
                    EndTerminal.trim().length < 2
                      ? 'Terminal name should be at least 2 characters long'
                      : StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase()
                      ? 'End terminal cannot be same as start terminal'
                      : ""
                  ) 
                : "Enter the destination point of the route"
            }
          >
            <Input
              placeholder="e.g., Mexico, Piassa, Gofa"
              value={EndTerminal}
              onChange={(e) => {
                // Allow letters, numbers, spaces, and common punctuation
                const value = e.target.value.replace(/[^A-Za-z0-9\s.,'-]/g, '');
                // Limit to 50 characters
                const limited = value.substring(0, 50);
                setEndTerminal(limited);
              }}
              size="large"
              prefix={
                <Space size={4}>
                  <FaMapPin style={{ color: '#bfbfbf' }} />
                  {EndTerminal && EndTerminal.trim().length >= 2 && (
                    <Tag color="orange" style={{ fontSize: '10px', padding: '0 4px', height: '16px' }}>
                      END
                    </Tag>
                  )}
                </Space>
              }
              style={{ borderRadius: '6px' }}
              allowClear
              maxLength={50}
              onBlur={() => {
                // Capitalize first letter of each word
                if (EndTerminal.trim()) {
                  const capitalized = EndTerminal
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                  setEndTerminal(capitalized);
                }
              }}
            />
          </Form.Item>
        </Card>

        {/* Route Preview */}
        {(StartTerminal.trim() && EndTerminal.trim()) && (
          <Card
            size="small"
            style={{ 
              marginBottom: 24, 
              borderColor: isFormValid ? '#b7eb8f' : '#ffe58f',
              backgroundColor: isFormValid ? '#f6ffed' : '#fffbe6'
            }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            <Space align="start">
              <FaRoute style={{ 
                color: isFormValid ? '#52c41a' : '#faad14',
                marginTop: '2px'
              }} />
              <div>
                <Text strong style={{ color: isFormValid ? '#389e0d' : '#d48806' }}>
                  Route Preview
                </Text>
                <div style={{ marginTop: '4px' }}>
                  <Text style={{ fontWeight: 500 }}>{StartTerminal.trim() || 'Start Terminal'}</Text>
                  <Text type="secondary" style={{ margin: '0 8px' }}>→</Text>
                  <Text style={{ fontWeight: 500 }}>{EndTerminal.trim() || 'End Terminal'}</Text>
                </div>
                {StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase() ? (
                  <Text type="danger" style={{ fontSize: '12px', marginTop: '4px' }}>
                    ⚠️ Start and end terminals cannot be identical
                  </Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                    ✓ Route will be saved as: {StartTerminal.trim()} → {EndTerminal.trim()}
                  </Text>
                )}
              </div>
            </Space>
          </Card>
        )}

        {/* Form Requirements */}
        {/* <Alert
          message="Requirements"
          description={
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text>• Both terminals are required</Text>
              <Text>• Each terminal must be at least 2 characters long</Text>
              <Text>• Start and end terminals must be different</Text>
              <Text>• Use clear, descriptive terminal names</Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24, borderRadius: '8px' }}
        /> */}

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
              background: isFormValid ? '#52c41a' : '#d9d9d9',
              borderColor: isFormValid ? '#52c41a' : '#d9d9d9'
            }}
            icon={<FaRoute />}
          >
            {loading ? 'Creating Route...' : 'Create Route'}
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
            Routes cannot be modified after creation. Please verify information before submitting.
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateRoutes;