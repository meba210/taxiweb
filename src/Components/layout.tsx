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