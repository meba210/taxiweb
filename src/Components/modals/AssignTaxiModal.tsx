import { Modal, Select, Form, Button, Checkbox, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRightLong } from "react-icons/fa6";

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

  // Fetch taxis for THIS route (by route name)
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

  

  // Fetch all routes EXCEPT current
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


    useEffect(() => {
    if (isModalOpen) {
      fetchQueue();  
      fetchRoutes();
      form.resetFields();
    }
  }, [isModalOpen, routeName, routeId]);
  const openRouteModal = async () => {
    await form.validateFields();
    setRouteModalOpen(true);
  };

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
      }
      
    );
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
      <Modal
        title={`Taxis in ${routeName}`}
        open={isModalOpen}
        onCancel={onClose}
        footer={[
          <Button onClick={onClose}>Cancel</Button>,
          <Button type="primary" onClick={openRouteModal}>
            Assign To <FaArrowRightLong />
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="taxi_ids"
            rules={[{ required: true, message: "Select at least 1 taxi" }]}
          >
            {queue.length === 0 ? (
              <p>No taxis available in this route</p>
            ) : (
              <Checkbox.Group>
                {queue.map((t, idx) => (
                  <Checkbox key={idx} value={t.PlateNo}>
                    {idx + 1}. Taxi — {t.PlateNo}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Select Destination Route"
        open={routeModalOpen}
        onCancel={() => setRouteModalOpen(false)}
        footer={[
          <Button onClick={() => setRouteModalOpen(false)}>Back</Button>,
          <Button
            type="primary"
            disabled={!selectedRoute}
            onClick={handleFinalAssign}
          >
            Confirm Assignment
          </Button>,
        ]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Choose destination route"
          onChange={(v) => setSelectedRoute(v)}
        >
          {routes.map((route) => (
            <Select.Option key={route.id} value={route.id}>
              {route.StartTerminal} → {route.EndTerminal}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}

