import { Button, Input, Table } from "antd";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

type RouteTaxi = {
  id: number;
  Routes: string;  
  Taxis: number;    
};

export default function TaxAssignment() {
  const [searchText, setSearchText] = useState("");
  const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Routes",
      dataIndex: "Routes",
      key: "Routes",
    },
    {
      title: "Available Taxis",
      dataIndex: "Taxis",
      key: "Taxis",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RouteTaxi) => (
        <div className="flex gap-2">
          <Button type="primary">
            Assign
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = routeTaxiList.filter((item) =>
    item.Routes.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchTaxiAssignment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/taxiAssignment");
      setRouteTaxiList(res.data);
    } catch (err) {
      console.error("Failed to fetch taxi assignments:", err);
    }
  };

  useEffect(() => {
    fetchTaxiAssignment();
  }, []);

  return (
    <>
      <div className="flex justify-end">
        <Input
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search Route"
          className="pl-10 rounded-2xl w-[200px] h-11 mt-5"
          prefix={<CiSearch className="text-gray-400" />}
        />
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
        />
      </div>
    </>
  );
}
