
import { Button, Input, Table, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditRoutesModal from "../Components/modals/EditRoutesModal";
import CreateRoutes from "../Components/modals/CreateRoutes";

type Route = {
  id: number;
  StartTerminal: string;
  EndTerminal: string;
};

export default function Routess() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchText, setSearchText] = useState("");
  const [IsCreateRoutesOpen, setIsCreateRoutesOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) console.warn("No token found! Login required.");

  // Fetch routes
  const fetchRoutes = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched routes:", res.data);
      setRoutes(res.data);
    } catch (err: any) {
      console.error("Failed to fetch routes:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to fetch routes");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Delete route
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    if (!token) return;

    try {
      const res = await axios.delete(`http://localhost:5000/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success(res.data.message || "Route deleted");
      fetchRoutes(); // Refresh routes
    } catch (err: any) {
      console.error("Failed to delete route:", err.response?.data || err);
      message.error(err.response?.data?.message || "Failed to delete route");
    }
  };

  // Edit route
  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRoute(null);
  };
  const handleRouteUpdated = () => fetchRoutes();

  const filteredRoutes = routes.filter(
    (route) =>
      route.StartTerminal.toLowerCase().includes(searchText.toLowerCase()) ||
      route.EndTerminal.toLowerCase().includes(searchText.toLowerCase())
  );

  const showCreateRoutes = () => setIsCreateRoutesOpen(true);
  const closeCreateRoutes = () => setIsCreateRoutesOpen(false);

  const columns = [
    { title: "Start Terminal", dataIndex: "StartTerminal", key: "StartTerminal" },
    { title: "End Terminal", dataIndex: "EndTerminal", key: "EndTerminal" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Route) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            <TbEdit />
          </Button>
          {isEditModalOpen && editingRoute && (
            <EditRoutesModal
              isOpen={isEditModalOpen}
              handleCancel={closeEditModal}
              route={editingRoute}
              onUpdated={handleRouteUpdated}
            />
          )}
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            <RiDeleteBin6Line />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end gap-2 mt-5">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search stations"
          className="pl-10 rounded-2xl w-[200px] h-11"
          prefix={<CiSearch className="text-gray-400" />}
        />
        <Button onClick={showCreateRoutes}>Create New Routes</Button>
        {IsCreateRoutesOpen && (
          <CreateRoutes
            isModalOpen={IsCreateRoutesOpen}
            handleCancel={closeCreateRoutes}
            onRoutesCreated={fetchRoutes}
          />
        )}
      </div>

      <div className="mt-5">
        <Table columns={columns} dataSource={filteredRoutes} rowKey="id" />
      </div>
    </>
  );
}
