// import { Modal, Input, Button, message } from "antd";
// import { useState, useEffect } from "react";
// import axios from "axios";

// type Routes= {
//   id: number;
//   StartTerminal: string;
//   EndTerminal: string;
 
// };

// type EditRoutesModalProps = {
//   isOpen: boolean;
//   handleCancel: () => void;
//   route: Routes | null;
//   onUpdated: (updatedRoute: Routes) => void;
// };

// const EditRoutesModal: React.FC<EditRoutesModalProps> = ({
//   isOpen,
//   handleCancel,
//   route,
//   onUpdated,
// }) => {
//   const [StartTerminal, setStartTerminal] = useState("");
//   const [EndTerminal, setEndTerminal] = useState("");
 
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//    if (isOpen && route) {
//      setStartTerminal(route.StartTerminal);
//        setEndTerminal(route. EndTerminal);
   
//     }
//   }, [isOpen, route]);

//   const handleUpdate = async () => {
   
//     if (!StartTerminal|| !EndTerminal ) {
//       message.warning("Please fill all fields");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       message.error("No token found. Please login again.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.put(`http://localhost:5000/routes/${route?.id}`, {
//          StartTerminal,
//         EndTerminal,
         
//       },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//     );
//       message.success(res.data.message || "✅route updated!");
//       onUpdated({ ...route!, StartTerminal: StartTerminal,  EndTerminal:  EndTerminal });
//       handleCancel();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to update route");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal open={isOpen} onCancel={handleCancel} footer={null} title="Edit Route" maskClosable={true}>
//       <div className="space-y-3">
//         <Input placeholder="StartTerminal" value={StartTerminal} onChange={(e) => setStartTerminal(e.target.value)} />
//         <Input placeholder=" EndTerminal" value={ EndTerminal} onChange={(e) => setEndTerminal(e.target.value)} />
       
//         <Button type="primary" loading={loading} onClick={handleUpdate} className="w-full">
//           Save
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default EditRoutesModal;


import { Modal, Input, Button, message, Form, Card, Space, Typography, Alert, Divider, Tag } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRoute, FaMapMarkerAlt, FaMapPin, FaExclamationCircle, FaCheckCircle, FaEdit, FaInfoCircle } from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";

const { Title, Text } = Typography;

type Routes = {
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
  const [form] = Form.useForm();
  const [StartTerminal, setStartTerminal] = useState("");
  const [EndTerminal, setEndTerminal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [originalRoute, setOriginalRoute] = useState<Routes | null>(null);

  useEffect(() => {
    if (isOpen && route) {
      setStartTerminal(route.StartTerminal);
      setEndTerminal(route.EndTerminal);
      setOriginalRoute(route);
      form.setFieldsValue({
        StartTerminal: route.StartTerminal,
        EndTerminal: route.EndTerminal,
      });
    }
  }, [isOpen, route]);

  // Check form validity
  useEffect(() => {
    const isValid = StartTerminal && 
                    EndTerminal && 
                    StartTerminal.trim().length >= 2 && 
                    EndTerminal.trim().length >= 2 &&
                    StartTerminal.trim().toLowerCase() !== EndTerminal.trim().toLowerCase();
    setIsFormValid(!!isValid);
  }, [StartTerminal, EndTerminal]);

  const handleUpdate = async () => {
    // Enhanced validation with specific messages
    if (!StartTerminal.trim()) {
      message.warning("Please enter the start terminal");
      return;
    }

    if (StartTerminal.trim().length < 2) {
      message.warning("Start terminal should be at least 2 characters long");
      return;
    }

    if (!EndTerminal.trim()) {
      message.warning("Please enter the end terminal");
      return;
    }

    if (EndTerminal.trim().length < 2) {
      message.warning("End terminal should be at least 2 characters long");
      return;
    }

    if (StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase()) {
      message.warning("Start and end terminals cannot be the same");
      return;
    }

    // Check if anything has actually changed
    if (originalRoute && 
        StartTerminal.trim() === originalRoute.StartTerminal && 
        EndTerminal.trim() === originalRoute.EndTerminal) {
      message.info("No changes detected. Please modify at least one field.");
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
        StartTerminal: StartTerminal.trim(),
        EndTerminal: EndTerminal.trim(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success({
        content: res.data.message || "✅ Route updated successfully!",
        duration: 3,
        icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
      });
      
      onUpdated({ 
        ...route!, 
        StartTerminal: StartTerminal.trim(), 
        EndTerminal: EndTerminal.trim() 
      });
      handleCancel();
    } catch (err: any) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Failed to update route",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalRoute) return false;
    return StartTerminal.trim() !== originalRoute.StartTerminal || 
           EndTerminal.trim() !== originalRoute.EndTerminal;
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
            backgroundColor: '#52c41a',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaEdit size={20} color="#fff" />
          </div>
          <Title level={4} style={{ margin: 0 }}>Edit Route</Title>
          {route && (
            <Tag color="blue" style={{ marginLeft: 8 }}>ID: {route.id}</Tag>
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
          message="Update route information"
          description={route ? `Editing route: ${route.StartTerminal} → ${route.EndTerminal}` : "Loading route information..."}
          type="info"
          showIcon
          icon={<FaExclamationCircle />}
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />

        {/* Route Information Card */}
        <Card
          title={
            <Space>
              <GiPathDistance style={{ color: '#52c41a' }} />
              <Text strong>Route Details</Text>
              {hasChanges() && (
                <Tag color="orange" style={{ marginLeft: '8px' }}>Unsaved Changes</Tag>
              )}
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, borderColor: '#e8e8e8' }}
          bodyStyle={{ padding: '16px' }}
        >
          {/* Start Terminal */}
          <Form.Item
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
                      : originalRoute && StartTerminal.trim() !== originalRoute.StartTerminal
                      ? <Space size={4}><FaInfoCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalRoute.StartTerminal}"</Text></Space>
                      : ""
                  ) 
                : "Enter the starting point of the route"
            }
          >
            <Input
              placeholder="e.g., Bole Airport, Merkato"
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
          </Divider>

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
                      : originalRoute && EndTerminal.trim() !== originalRoute.EndTerminal
                      ? <Space size={4}><FaInfoCircle style={{ color: '#1890ff' }} /><Text type="secondary">Changed from "{originalRoute.EndTerminal}"</Text></Space>
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

        {/* Route Comparison */}
        {originalRoute && hasChanges() && (
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
              <Text strong style={{ color: '#389e0d' }}>Changes Preview</Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Original</Text>
                  <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                    {originalRoute.StartTerminal} → {originalRoute.EndTerminal}
                  </Text>
                </div>
                <FaRoute style={{ color: '#52c41a' }} />
                <div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>Updated</Text>
                  <Text style={{ fontSize: '12px', fontWeight: 500, color: '#1890ff' }}>
                    {StartTerminal.trim()} → {EndTerminal.trim()}
                  </Text>
                </div>
              </div>
              {originalRoute.StartTerminal !== StartTerminal.trim() && (
                <Alert
                  message={`Start terminal will change from "${originalRoute.StartTerminal}" to "${StartTerminal.trim()}"`}
                  type="info"
                  showIcon
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              )}
              {originalRoute.EndTerminal !== EndTerminal.trim() && (
                <Alert
                  message={`End terminal will change from "${originalRoute.EndTerminal}" to "${EndTerminal.trim()}"`}
                  type="info"
                  showIcon
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                />
              )}
            </Space>
          </Card>
        )}

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
                  <Tag color="blue" style={{ marginRight: '8px' }}>
                    {StartTerminal.trim()}
                  </Tag>
                  <Text type="secondary" style={{ margin: '0 8px' }}>→</Text>
                  <Tag color="orange">
                    {EndTerminal.trim()}
                  </Tag>
                </div>
                {StartTerminal.trim().toLowerCase() === EndTerminal.trim().toLowerCase() ? (
                  <Text type="danger" style={{ fontSize: '12px', marginTop: '4px' }}>
                    ⚠️ Start and end terminals cannot be identical
                  </Text>
                ) : (
                  <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
                    ✓ Route will be updated to: {StartTerminal.trim()} → {EndTerminal.trim()}
                  </Text>
                )}
              </div>
            </Space>
          </Card>
        )}

        {/* Form Requirements */}
        <Alert
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
        />

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
              background: (isFormValid && hasChanges()) ? '#52c41a' : '#d9d9d9',
              borderColor: (isFormValid && hasChanges()) ? '#52c41a' : '#d9d9d9'
            }}
            icon={<FaEdit />}
          >
            {loading ? 'Updating...' : 'Update Route'}
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
            Route ID: {route?.id} • All connected dispatchers and taxis will be notified of this change
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default EditRoutesModal;