import { Modal, Select, Form, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

type Taxi = {
  id: number;
  DriversName: string;
  PlateNo: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  routeId: number;
  onAssigned: () => void; 
};

export default function AssignTaxiModal({ open, onClose, routeId, onAssigned }: Props) {
  const [form] = Form.useForm();
  const [taxis, setTaxis] = useState<Taxi[]>([]);

  // Fetch unassigned taxis
  const fetchTaxis = async () => {
    try {
      const res = await axios.get("http://localhost:5000/taxis");
      setTaxis(res.data);
    } catch (err) {
      console.error("Failed to load taxis:", err);
    }
  };

  useEffect(() => {
    if (open) fetchTaxis();
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      await axios.put("http://localhost:5000/taxis/assign", {
        taxi_id: values.taxi_id,
        route_id: routeId,
      });

      onAssigned(); 
      form.resetFields();
      onClose();
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  return (
    <Modal
      title="Assign Taxi to Route"
      open={open}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit}>
          Assign
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="taxi_id"
          label="Select Taxi"
          rules={[{ required: true, message: "Please select a taxi" }]}
        >
          <Select placeholder="Choose a taxi">
            {taxis.map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.DriversName} — Plate: {t.PlateNo}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
