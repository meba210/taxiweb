// // import { Button, Input, Table } from "antd";
// // import { useEffect, useState } from "react";
// // import { CiSearch } from "react-icons/ci";
// // import AssignTaxiModal from "../Components/modals/AssignTaxiModal"
// // import axios from "axios";
// // import { FaArrowRightLong } from "react-icons/fa6";

// // type RouteTaxi = {
// //   id: number;
// //   Routes: string;  
// //   Taxis: number;  
 
// // };

// // export default function TaxAssignment() {
// //   const [searchText, setSearchText] = useState("");
// //   const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
// //  const [isModalOpen, setIsModalOpen] = useState(false);
// //   const showModal = () => setIsModalOpen(true);
// //   const closeModal = () => setIsModalOpen(false);
// //   const handleSearch = (value: string) => {
// //     setSearchText(value);
// //   };

// //   const columns = [
// //     {
// //       title: "Routes",
// //       dataIndex: "Routes",
// //       key: "Routes",
// //     },
// //     {
// //       title: "Available Taxis",
// //       dataIndex: "Taxis",
// //       key: "Taxis",
// //     },
// //     {
// //        title: "Passengers",
// //       dataIndex: "WaitingCount",
// //       key: "Passengers",
// //     },
// //     {
// //       title: "Actions",
// //       key: "actions",
// //       render: (_: any, record: RouteTaxi) => (
// //         <div className="flex gap-2">
// //           <Button type="primary"   onClick={() => {
// //    setIsModalOpen(true);
// //   }}>
// //             Assign 
// //           </Button>
// //           {isModalOpen && (
// //           <AssignTaxiModal
// //               isModalOpen={isModalOpen}
// //               onClose={closeModal} routeId={0} onAssigned={function (): void {
// //                 throw new Error("Function not implemented.");
// //               } }            // onRoutesCreated={fetchRoutes}
// //           />
// //         )}
// //         </div>
// //       ),
// //     },
// //   ];

// //   const filteredData = routeTaxiList.filter((item) =>
// //     item.Routes.toLowerCase().includes(searchText.toLowerCase())
// //   );

// //   const fetchTaxiAssignment = async () => {
    
// //       const token = localStorage.getItem("token");
// //   if (!token) console.warn("No token found! Login required.");
// //     if (!token) return;
// //     try {
// //       const res = await axios.get("http://localhost:5000/taxiAssignment",
// //    {headers: { Authorization: `Bearer ${token}` }})
// //       setRouteTaxiList(res.data);
// //     } catch (err) {
// //       console.error("Failed to fetch taxi assignments:", err);
// //     }
// //   };

// //  useEffect(() => {
// //   fetchTaxiAssignment();     
// //   const interval = setInterval(() => {
// //     fetchTaxiAssignment();   
// //   }, 10000); 

// //   return () => clearInterval(interval);
// // }, []);


// //   return (
// //     <>
// //       <div className="flex justify-end">
// //         <Input
// //           value={searchText}
// //           onChange={(e) => handleSearch(e.target.value)}
// //           placeholder="Search Route"
// //           className="pl-10 rounded-2xl w-[200px] h-11 mt-5"
// //           prefix={<CiSearch className="text-gray-400" />}
// //         />
// //       </div>

// //       <div>
// //         <Table
// //           columns={columns}
// //           dataSource={filteredData}
// //           rowKey="id"
// //         />
// //       </div>
// //     </>
// //   );
// // }


// import { Button, Input, Table } from "antd";
// import { useEffect, useState } from "react";
// import { CiSearch } from "react-icons/ci";
// import AssignTaxiModal from "../Components/modals/AssignTaxiModal";
// import axios from "axios";

// type RouteTaxi = {
//   id: number;
//   Routes: string;
//   Taxis: number;
//   WaitingCount: number;
// };

// export default function TaxAssignment() {
//   const [searchText, setSearchText] = useState("");
//   const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
//   const [modalRouteId, setModalRouteId] = useState<number | null>(null);
//   const [selectedRoute, setSelectedRoute] = useState<RouteTaxi | null>(null);
//   const handleSearch = (value: string) => setSearchText(value);

//   const columns = [
//     {
//       title: "Routes",
//       dataIndex: "Routes",
//       key: "Routes",
//     },
//     {
//       title: "Available Taxis",
//       dataIndex: "Taxis",
//       key: "Taxis",
//     },
//     {
//       title: "Passengers",
//       dataIndex: "WaitingCount",
//       key: "Passengers",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: RouteTaxi) => (
//         <Button
//           type="primary"
//            onClick={() => {
//     setSelectedRoute(record);     // set route object
//     setModalRouteId(record.id);   // show modal
//   }}

//         >
//           Assign
//         </Button>
//       ),
//     },
//   ];

//   const filteredData = routeTaxiList.filter((item) =>
//     item.Routes.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const fetchTaxiAssignment = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return console.warn("No token found! Login required.");

//     try {
//       const res = await axios.get("http://localhost:5000/taxiAssignment", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setRouteTaxiList(res.data);
//     } catch (err) {
//       console.error("Failed to fetch taxi assignments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTaxiAssignment();
//     const interval = setInterval(fetchTaxiAssignment, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <div className="flex justify-end mb-4">
//         <Input
//           value={searchText}
//           onChange={(e) => handleSearch(e.target.value)}
//           placeholder="Search Route"
//           className="pl-10 rounded-2xl w-[200px] h-11"
//           prefix={<CiSearch className="text-gray-400" />}
//         />
//       </div>

//       <Table columns={columns} dataSource={filteredData} rowKey="id" />

//       {/* Assign Taxi Modal */}
//       {modalRouteId && (
//          <AssignTaxiModal
//     isModalOpen={true}
//     routeId={modalRouteId}
//     routeName={selectedRoute.Routes} 
//     onClose={() => {
//       setModalRouteId(null);
//       setSelectedRoute(null);
//     }}
//     onAssigned={fetchTaxiAssignment}
//   />
//       )}
//     </>
//   );
// }


import { Button, Input, Table } from "antd";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import AssignTaxiModal from "../Components/modals/AssignTaxiModal";
import axios from "axios";

type RouteTaxi = {
  id: number;
  Routes: string;
  Taxis: number;
  WaitingCount: number;
};

export default function TaxAssignment() {
  const [searchText, setSearchText] = useState("");
  const [routeTaxiList, setRouteTaxiList] = useState<RouteTaxi[]>([]);
  const [modalRouteId, setModalRouteId] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteTaxi | null>(null);

  const columns = [
    { title: "Routes", dataIndex: "Routes", key: "Routes" },
    { title: "Available Taxis", dataIndex: "Taxis", key: "Taxis" },
    { title: "Passengers", dataIndex: "WaitingCount", key: "Passengers" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RouteTaxi) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedRoute(record);
            setModalRouteId(record.id);
          }}
        >
          Assign
        </Button>
      ),
    },
  ];

  const filteredData = routeTaxiList.filter((item) =>
    item.Routes.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchTaxiAssignment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/taxiAssignment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRouteTaxiList(res.data);
    } catch (err) {
      console.error("Failed to fetch taxi assignments:", err);
    }
  };

  useEffect(() => {
    fetchTaxiAssignment();
    const interval = setInterval(fetchTaxiAssignment, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search Route"
          className="pl-10 rounded-2xl w-[200px] h-11"
          prefix={<CiSearch className="text-gray-400" />}
        />
      </div>

      <Table columns={columns} dataSource={filteredData} rowKey="id" />

      {modalRouteId && selectedRoute && (
        <AssignTaxiModal
          isModalOpen={true}
          routeId={modalRouteId}
          routeName={selectedRoute.Routes}
          onClose={() => {
            setModalRouteId(null);
            setSelectedRoute(null);
          }}
          onAssigned={fetchTaxiAssignment}
        />
      )}
    </>
  );
}
