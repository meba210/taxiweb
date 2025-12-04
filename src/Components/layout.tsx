import { HomeOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { BsPersonRolodex } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { LiaTaxiSolid } from "react-icons/lia";
import { TbBusStop, TbReportAnalytics, TbRouteScan} from "react-icons/tb";
import { Outlet, useNavigate } from "react-router-dom";

type LayoutsProps = {
  role: 'admin' | 'stationAdmin';
};


export default function Layouts ({role}: LayoutsProps ) {
   const navigate = useNavigate();

    const menuItems =
    role === 'admin'
      ? [
          { key: 'Dashboard',icon:<HomeOutlined />, label: 'Dashboard', onClick: () => navigate('/admin') },
          { key: 'Stations',icon:<TbBusStop />, label: 'Stations', onClick: () => navigate('/admin/Stations') },
           { key: 'Station Admins',icon:<GrUserAdmin />, label: 'Station Admins', onClick: () => navigate('/admin/StationAdmins') },
            { key: ' Reports',icon:<TbReportAnalytics />, label: ' Reports ', onClick: () => navigate('/admin/Reports') },
             { key: 'System Settings',icon:<CiSettings />, label: 'System Settings', onClick: () => navigate('/admin/SystemSettings') },
        ]
      : [
         { key: 'Dashboard',icon:<HomeOutlined />, label: 'Dashboard', onClick: () => navigate('/stationAdmin') },
          { key: ' Routes',icon:<TbRouteScan />, label: ' Routes', onClick: () => navigate('/stationAdmin/Routes') },
           { key: 'Dispachers',icon:< BsPersonRolodex  />, label: 'Dispachers', onClick: () => navigate('/stationAdmin/Dispachers') },
            { key: 'Taxi Assignment',icon:<LiaTaxiSolid />, label: 'Taxi Assignment ', onClick: () => navigate('/stationAdmin/TaxiAssignment') },
             { key: 'Reports',icon:<TbReportAnalytics />, label: 'Reports', onClick: () => navigate('/stationAdmin/Reports') },
        ];
return(
    <Layout style={{ minHeight: '100vh' }}>
      <Sider className="!bg-blue-200 backdrop-blur-md shadow-lg border-r border-blue-200 rounded-md pt-20 mt-5 mr-5 ">
        <Menu  
        className="!bg-transparent !text-white mt-30 font-semi-bold !text-lg  
        [&_.ant-menu-item]:mb-400  
        [&_.ant-menu-item:hover]:!bg-blue-600/40
         [&_.ant-menu-item-icon]:text-white/90
            [&_.ant-menu-item-icon]:text-xl
        " 
        mode="inline" 
        items={menuItems} />
      </Sider>
      <Layout>
        <Header className="!bg-blue-200 rounded-md ml-5 mr-5 mb-10 mt-5 !text-2xl font-bold  shadow-md pt-200">Welcome {role}</Header>
        <Content className="!bg-gray-200">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
)
}



// import { useState } from "react";
// import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import { Layout, Menu } from "antd";
// import { Content, Header } from "antd/es/layout/layout";
// import Sider from "antd/es/layout/Sider";
// import { BsPersonRolodex } from "react-icons/bs";
// import { CiSettings } from "react-icons/ci";
// import { GrUserAdmin } from "react-icons/gr";
// import { LiaTaxiSolid } from "react-icons/lia";
// import { TbBusStop, TbReportAnalytics, TbRouteScan } from "react-icons/tb";
// import { Outlet, useNavigate } from "react-router-dom";

// type LayoutsProps = {
//   role: "admin" | "stationAdmin";
// };

// export default function Layouts({ role }: LayoutsProps) {
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);

//   const menuItems =
//     role === "admin"
//       ? [
//           { key: "Dashboard", icon: <HomeOutlined />, label: "Dashboard", onClick: () => navigate("/admin") },
//           { key: "Stations", icon: <TbBusStop />, label: "Stations", onClick: () => navigate("/admin/Stations") },
//           { key: "Station Admins", icon: <GrUserAdmin />, label: "Station Admins", onClick: () => navigate("/admin/StationAdmins") },
//           { key: "Reports", icon: <TbReportAnalytics />, label: "Reports", onClick: () => navigate("/admin/Reports") },
//           { key: "Settings", icon: <CiSettings />, label: "System Settings", onClick: () => navigate("/admin/SystemSettings") },
//         ]
//       : [
//           { key: "Dashboard", icon: <HomeOutlined />, label: "Dashboard", onClick: () => navigate("/stationAdmin") },
//           { key: "Routes", icon: <TbRouteScan />, label: "Routes", onClick: () => navigate("/stationAdmin/Routes") },
//           { key: "Dispachers", icon: <BsPersonRolodex />, label: "Dispachers", onClick: () => navigate("/stationAdmin/Dispachers") },
//           { key: "Taxi Assignment", icon: <LiaTaxiSolid />, label: "Taxi Assignment", onClick: () => navigate("/stationAdmin/TaxiAssignment") },
//           { key: "Reports", icon: <TbReportAnalytics />, label: "Reports", onClick: () => navigate("/stationAdmin/Reports") },
//         ];

//   return (
//     <Layout className="min-h-screen bg-slate-100 flex flex-row overflow-hidden">

//       {/* SIDEBAR */}
//       <Sider
//         collapsed={collapsed}
//         width={250}
//         className={`
//           fixed top-0 left-0 h-full z-50 transition-all duration-300 
//           backdrop-blur-xl bg-blue-600/80 shadow-xl 
//           border-r border-blue-300
//           ${collapsed ? "w-20" : "w-60"} 
//           lg:relative
//         `}
//       >
//         {/* LOGO */}
//         <div className="text-white text-center font-bold tracking-wide text-xl py-6">
//           {!collapsed ? "TAXI SYSTEM" : "TS"}
//         </div>

//         {/* MENU */}
//         <Menu
//           className="
//             !bg-transparent !text-white font-medium 
//             [&_.ant-menu-item-selected]:!bg-blue-700/70 
//             [&_.ant-menu-item:hover]:!bg-blue-500/40
//             [&_.ant-menu-title-content]:text-white
//             [&_.ant-menu-item-icon]:text-white
//           "
//           mode="inline"
//           items={menuItems}
//         />
//       </Sider>

//       {/* MAIN CONTENT */}
//       <Layout
//         className={`
//           transition-all duration-300 w-full 
//           ${collapsed ? "lg:ml-20" : "lg:ml-60"}
//         `}
//       >

//         {/* HEADER */}
//         <Header
//           className="
//             !bg-white shadow-md rounded-md mx-4 mt-4 mb-6 px-4 
//             flex items-center justify-between 
//             h-16 border border-slate-200
//           "
//         >
//           {/* Collapse Button */}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="text-blue-600 text-xl hover:scale-110 transition-transform"
//           >
//             {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//           </button>

//           <div className="text-blue-700 font-semibold text-lg">
//             Welcome {role}
//           </div>

//           <div></div>
//         </Header>

//         {/* PAGE CONTENT */}
//         <Content className="bg-white shadow-inner p-4 rounded-md mx-4 mb-6 min-h-screen">
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }

