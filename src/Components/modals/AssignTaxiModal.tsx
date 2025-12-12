// import { Modal, Select, Form, Button, Checkbox, message } from "antd";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaArrowRightLong } from "react-icons/fa6";

// type Props = {
//   isModalOpen: boolean;
//   onClose: () => void;
//   routeId: number;
//   routeName: string;     
//   onAssigned: () => void;
// };

// export default function AssignTaxiModal({
//   isModalOpen,
//   onClose,
//   routeId,
//   routeName,
//   onAssigned,
// }: Props) {
//   const [form] = Form.useForm();
//   const [queue, setQueue] = useState<{ PlateNo: string }[]>([]);
//   const [routes, setRoutes] = useState<any[]>([]);
//   const [routeModalOpen, setRouteModalOpen] = useState(false);
//   const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

//   // Fetch taxis for THIS route (by route name)
//   const fetchQueue = async () => {
//     try {
//       const token = localStorage.getItem("token");
 
//       const res = await axios.get(
//          `http://localhost:5000/assignTaxis?route=${encodeURIComponent(routeName)}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setQueue(res.data);
//     } catch (err) {
//       console.error("Failed to fetch taxis:", err);
//     }
//   };

  

//   // Fetch all routes EXCEPT current
//   const fetchRoutes = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`http://localhost:5000/routes`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setRoutes(res.data.filter((r: any) => r.id !== routeId));
//     } catch (err) {
//       console.error("Failed to fetch routes:", err);
//     }
//   };


//     useEffect(() => {
//     if (isModalOpen) {
//       fetchQueue();  
//       fetchRoutes();
//       form.resetFields();
//     }
//   }, [isModalOpen, routeName, routeId]);
//   const openRouteModal = async () => {
//     await form.validateFields();
//     setRouteModalOpen(true);
//   };

//   const handleFinalAssign = async () => {
//     try {
//       const values = form.getFieldsValue();
//            const token = localStorage.getItem("token");
//       const res = await axios.post("http://localhost:5000/assignTaxis", {
//         taxi_ids: values.taxi_ids,
//         to_route: selectedRoute,
//           from_route: routeName, 
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
      
//     );
//         message.success(res.data.message || "Taxi assigned successfully!");
//       onAssigned();
//       onClose();
//       setRouteModalOpen(false);
//     } catch (err) {
//       console.error("Assignment failed:", err);
//     }
//   };



//   return (
//     <>
//       <Modal
//         title={`Taxis in ${routeName}`}
//         open={isModalOpen}
//         onCancel={onClose}
//         footer={[
//           <Button onClick={onClose}>Cancel</Button>,
//           <Button type="primary" onClick={openRouteModal}>
//             Assign To <FaArrowRightLong />
//           </Button>,
//         ]}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="taxi_ids"
//             rules={[{ required: true, message: "Select at least 1 taxi" }]}
//           >
//             {queue.length === 0 ? (
//               <p>No taxis available in this route</p>
//             ) : (
//               <Checkbox.Group>
//                 {queue.map((t, idx) => (
//                   <Checkbox key={idx} value={t.PlateNo}>
//                     {idx + 1}. Taxi — {t.PlateNo}
//                   </Checkbox>
//                 ))}
//               </Checkbox.Group>
//             )}
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title="Select Destination Route"
//         open={routeModalOpen}
//         onCancel={() => setRouteModalOpen(false)}
//         footer={[
//           <Button onClick={() => setRouteModalOpen(false)}>Back</Button>,
//           <Button
//             type="primary"
//             disabled={!selectedRoute}
//             onClick={handleFinalAssign}
//           >
//             Confirm Assignment
//           </Button>,
//         ]}
//       >
//         <Select
//           style={{ width: "100%" }}
//           placeholder="Choose destination route"
//           onChange={(v) => setSelectedRoute(v)}
//         >
//           {routes.map((route) => (
//             <Select.Option key={route.id} value={route.id}>
//               {route.StartTerminal} → {route.EndTerminal}
//             </Select.Option>
//           ))}
//         </Select>
//       </Modal>
//     </>
//   );
// }


import { Modal, Select, Form, Button, Checkbox, message, Card, Tag, Space, Alert } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRightLong, FaTaxi, FaRoute } from "react-icons/fa6";
import { IoCarSport } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  routeId: number;
  routeName: string;     
  onAssigned: () => void;
};

export default function AssignTaxiModal({
  isModalOpen,
  onClose,
  routeId,
  routeName,
  onAssigned,
}: Props) {
  const [form] = Form.useForm();
  const [queue, setQueue] = useState<{ PlateNo: string }[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  // Fetch taxis for THIS route (by route name) - EXACT SAME LOGIC
  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem("token");
 
      const res = await axios.get(
         `http://localhost:5000/assignTaxis?route=${encodeURIComponent(routeName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQueue(res.data);
    } catch (err) {
      console.error("Failed to fetch taxis:", err);
    }
  };

  // Fetch all routes EXCEPT current - EXACT SAME LOGIC
  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:5000/routes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoutes(res.data.filter((r: any) => r.id !== routeId));
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    }
  };

  // EXACT SAME LOGIC
  useEffect(() => {
    if (isModalOpen) {
      fetchQueue();  
      fetchRoutes();
      form.resetFields();
    }
  }, [isModalOpen, routeName, routeId]);

  // EXACT SAME LOGIC
  const openRouteModal = async () => {
    await form.validateFields();
    setRouteModalOpen(true);
  };

  // EXACT SAME LOGIC
  const handleFinalAssign = async () => {
    try {
      const values = form.getFieldsValue();
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/assignTaxis", {
        taxi_ids: values.taxi_ids,
        to_route: selectedRoute,
        from_route: routeName, 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      message.success(res.data.message || "Taxi assigned successfully!");
      onAssigned();
      onClose();
      setRouteModalOpen(false);
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  return (
    <>
      {/* First Modal - Only visual enhancements */}
      <Modal
        title={
          <Space align="center">
            <FaTaxi style={{ color: "#1890ff", fontSize: "18px" }} />
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Taxis in <span style={{ color: "#1890ff" }}>{routeName}</span>
            </span>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {queue.length} available
            </Tag>
          </Space>
        }
        open={isModalOpen}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose} style={{ borderRadius: "6px" }}>
            Cancel
          </Button>,
          <Button 
            key="assign" 
            type="primary" 
            onClick={openRouteModal}
            style={{ borderRadius: "6px" }}
            icon={<FaArrowRightLong />}
          >
            Assign To Route
          </Button>,
        ]}
        width={520}
        styles={{
          body: { paddingTop: "16px" },
          header: { borderBottom: "1px solid #f0f0f0", padding: "16px 24px" },
          footer: { borderTop: "1px solid #f0f0f0", padding: "16px 24px" }
        }}
      >
        {queue.length === 0 ? (
          <Card 
            bordered={false}
            style={{ 
              textAlign: "center", 
              padding: "40px 20px",
              backgroundColor: "#fafafa",
              borderRadius: "8px"
            }}
          >
            <IoCarSport style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "12px" }} />
            <p style={{ color: "#8c8c8c", margin: 0, fontSize: "16px" }}>
              No taxis available in this route
            </p>
          </Card>
        ) : (
          <Card
            bordered={false}
            style={{ 
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              padding: "16px"
            }}
          >
            <Alert
              message="Select taxis to assign to another route"
              type="info"
              showIcon
              style={{ marginBottom: "16px", borderRadius: "6px" }}
            />
            
            <Form form={form} layout="vertical">
              <Form.Item
                name="taxi_ids"
                rules={[{ required: true, message: "Select at least 1 taxi" }]}
                style={{ marginBottom: 0 }}
              >
                <Checkbox.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {queue.map((t, idx) => (
                      <Card
                        key={idx}
                        size="small"
                        style={{
                          marginBottom: "8px",
                          border: "1px solid #e8e8e8",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          transition: "all 0.2s"
                        }}
                        bodyStyle={{ padding: "12px" }}
                      >
                        <Checkbox value={t.PlateNo}>
                          <Space align="center">
                            <div style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              backgroundColor: "#1890ff",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 600
                            }}>
                              {idx + 1}
                            </div>
                            <FaTaxi style={{ color: "#1890ff", fontSize: "14px" }} />
                            <span style={{ fontWeight: 500, color: "#262626" }}>
                              Taxi <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{t.PlateNo}</span>
                            </span>
                          </Space>
                        </Checkbox>
                      </Card>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Modal>

      {/* Second Modal - Only visual enhancements */}
      <Modal
        title={
          <Space align="center">
            <FaRoute style={{ color: "#52c41a", fontSize: "18px" }} />
            <span style={{ fontSize: "18px", fontWeight: 600 }}>
              Select Destination Route
            </span>
          </Space>
        }
        open={routeModalOpen}
        onCancel={() => setRouteModalOpen(false)}
        footer={[
          <Button 
            key="back" 
            onClick={() => setRouteModalOpen(false)}
            style={{ borderRadius: "6px" }}
          >
            Back
          </Button>,
          <Button
            key="confirm"
            type="primary"
            disabled={!selectedRoute}
            onClick={handleFinalAssign}
            style={{ borderRadius: "6px" }}
          >
            Confirm Assignment
          </Button>,
        ]}
        width={500}
        styles={{
          body: { paddingTop: "16px" },
          header: { borderBottom: "1px solid #f0f0f0", padding: "16px 24px" },
          footer: { borderTop: "1px solid #f0f0f0", padding: "16px 24px" }
        }}
      >
        <Alert
          message={
            <Space>
              <FaMapMarkerAlt />
              <span>Choose where to assign the selected taxis</span>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: "20px", borderRadius: "6px" }}
        />

        <div style={{ marginBottom: "24px" }}>
          <div style={{ 
            backgroundColor: "#f6ffed", 
            border: "1px solid #b7eb8f",
            borderRadius: "6px",
            padding: "12px 16px",
            marginBottom: "16px"
          }}>
            <Space>
              <FaTaxi style={{ color: "#389e0d" }} />
              <span style={{ fontWeight: 500 }}>Assigning from:</span>
              <Tag color="blue">{routeName}</Tag>
            </Space>
          </div>

          <Select
            style={{ width: "100%" }}
            placeholder={
              <Space>
                <FaRoute style={{ color: "#8c8c8c" }} />
                <span>Choose destination route</span>
              </Space>
            }
            onChange={(v) => setSelectedRoute(v)}
            size="large"
            dropdownStyle={{ borderRadius: "6px" }}
            optionLabelProp="label"
          >
            {routes.map((route) => (
              <Select.Option 
                key={route.id} 
                value={route.id}
                label={`${route.StartTerminal} → ${route.EndTerminal}`}
              >
                <Card
                  size="small"
                  style={{ 
                    border: "none",
                    backgroundColor: "transparent",
                    padding: "8px 0"
                  }}
                  bodyStyle={{ padding: "0" }}
                >
                  <Space>
                    <FaRoute style={{ color: "#1890ff" }} />
                    <div>
                      <div style={{ fontWeight: 500, color: "#262626" }}>
                        {route.StartTerminal} → {route.EndTerminal}
                      </div>
                      <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "2px" }}>
                        Route ID: {route.id}
                      </div>
                    </div>
                  </Space>
                </Card>
              </Select.Option>
            ))}
          </Select>
        </div>

        {selectedRoute && (
          <Alert
            message={
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <div style={{ fontWeight: 500, color: "#389e0d" }}>
                  Ready to assign taxis
                </div>
                <div style={{ fontSize: "13px", color: "#595959" }}>
                  Click "Confirm Assignment" to complete the transfer
                </div>
              </Space>
            }
            type="success"
            showIcon
            style={{ borderRadius: "6px" }}
          />
        )}
      </Modal>
    </>
  );
}