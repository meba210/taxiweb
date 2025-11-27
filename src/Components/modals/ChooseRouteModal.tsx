import { Modal, Select, Form, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  excludeRouteId: number;
  onRouteSelected: (routeId: number) => void;
};

export default function SelectRouteModal({ 
  isOpen, 
  onClose, 
  excludeRouteId, 
  onRouteSelected 
}: Props) {

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:5000/routes/other/${excludeRouteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchRoutes();
  }, [isOpen]);

  return (
    <Modal
      title="Select Route to Assign"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Select
        className="w-full"
        loading={loading}
        placeholder="Select a Route"
        onChange={(id) => {
          onRouteSelected(id);
          onClose();
        }}
      >
        {routes.map((r: any) => (
          <Select.Option key={r.id} value={r.id}>
            {r.routeName}
          </Select.Option>
        ))}
      </Select>

      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}
