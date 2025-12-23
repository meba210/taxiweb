// import { HomeOutlined } from "@ant-design/icons";
// import { Layout, Menu } from "antd";
// import { Content, Header } from "antd/es/layout/layout";
// import Sider from "antd/es/layout/Sider";
// import { BsPersonRolodex } from "react-icons/bs";
// import { CiSettings } from "react-icons/ci";
// import { GrUserAdmin } from "react-icons/gr";
// import { LiaTaxiSolid } from "react-icons/lia";
// import { TbBusStop, TbReportAnalytics, TbRouteScan} from "react-icons/tb";
// import { Outlet, useNavigate } from "react-router-dom";

// type LayoutsProps = {
//   role: 'admin' | 'stationAdmin';
// };


// export default function Layouts ({role}: LayoutsProps ) {
//    const navigate = useNavigate();

//     const menuItems =
//     role === 'admin'
//       ? [
//           { key: 'Dashboard',icon:<HomeOutlined />, label: 'Dashboard', onClick: () => navigate('/admin') },
//           { key: 'Stations',icon:<TbBusStop />, label: 'Stations', onClick: () => navigate('/admin/Stations') },
//            { key: 'Station Admins',icon:<GrUserAdmin />, label: 'Station Admins', onClick: () => navigate('/admin/StationAdmins') },
//             { key: ' Reports',icon:<TbReportAnalytics />, label: ' Reports ', onClick: () => navigate('/admin/Reports') },
//              { key: 'System Settings',icon:<CiSettings />, label: 'System Settings', onClick: () => navigate('/admin/SystemSettings') },
//         ]
//       : [
//          { key: 'Dashboard',icon:<HomeOutlined />, label: 'Dashboard', onClick: () => navigate('/stationAdmin') },
//           { key: ' Routes',icon:<TbRouteScan />, label: ' Routes', onClick: () => navigate('/stationAdmin/Routes') },
//            { key: 'Dispachers',icon:< BsPersonRolodex  />, label: 'Dispachers', onClick: () => navigate('/stationAdmin/Dispachers') },
//             { key: 'Taxi Assignment',icon:<LiaTaxiSolid />, label: 'Taxi Assignment ', onClick: () => navigate('/stationAdmin/TaxiAssignment') },
//              { key: 'Reports',icon:<TbReportAnalytics />, label: 'Reports', onClick: () => navigate('/stationAdmin/Reports') },
//         ];
// return(
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider className="!bg-blue-200 backdrop-blur-md shadow-lg border-r border-blue-200 rounded-md pt-20 mt-5 mr-5 ">
//         <Menu  
//         className="!bg-transparent !text-white mt-30 font-semi-bold !text-lg  
//         [&_.ant-menu-item]:mb-400  
//         [&_.ant-menu-item:hover]:!bg-blue-600/40
//          [&_.ant-menu-item-icon]:text-white/90
//             [&_.ant-menu-item-icon]:text-xl
//         " 
//         mode="inline" 
//         items={menuItems} />
//       </Sider>
//       <Layout>
//         <Header className="!bg-blue-200 rounded-md ml-5 mr-5 mb-10 mt-5 !text-2xl font-bold  shadow-md pt-200">Welcome {role}</Header>
//         <Content className="!bg-gray-200">
//           <Outlet />
//         </Content>
//       </Layout>
//     </Layout>
// )
// }



import { useState, useEffect, useMemo, type JSX } from "react";
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, Tag } from "antd";
import type { MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { BsPersonRolodex, BsBell, BsGear } from "react-icons/bs";
import { CiSettings, CiLogout } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";
import { LiaTaxiSolid } from "react-icons/lia";
import { TbBusStop, TbReportAnalytics, TbRouteScan, TbUserCircle } from "react-icons/tb";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

type LayoutsProps = {
  role: 'admin' | 'stationAdmin';
};

type MenuItem = {
  key: string;
  icon: JSX.Element;
  label: string;
  path: string;
  color?: string;
};

export default function Layouts({ role }: LayoutsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Menu configuration
  const menuConfig: Record<'admin' | 'stationAdmin', MenuItem[]> = {
    admin: [
      { 
        key: 'Dashboard', 
        icon: <HomeOutlined />, 
        label: 'Dashboard', 
        path: '/admin',
        color: 'bg-gradient-to-r from-blue-300 to-blue-600'
      },
      { 
        key: 'Stations', 
        icon: <TbBusStop />, 
        label: 'Stations', 
        path: '/admin/Stations',
        color: 'bg-gradient-to-r from-gray-200 to-gray-600'
      },
      { 
        key: 'StationAdmins', 
        icon: <GrUserAdmin />, 
        label: 'Station Admins', 
        path: '/admin/StationAdmins',
        color: 'bg-gradient-to-r from-[#ad4e00] to-[#803800]'

      },
      { 
        key: 'Reports', 
        icon: <TbReportAnalytics />, 
        label: 'Reports', 
        path: '/admin/Reports',
        color: 'bg-gradient-to-r from-orange-500 to-amber-600'
      },
      { 
        key: 'SystemSettings', 
        icon: <CiSettings />, 
        label: 'System Settings', 
        path: '/admin/SystemSettings',
        color: 'bg-gradient-to-r from-gray-600 to-gray-700'
      },
    ],
    stationAdmin: [
      { 
        key: 'Dashboard', 
        icon: <HomeOutlined />, 
        label: 'Dashboard', 
        path: '/stationAdmin',
        color: 'bg-gradient-to-r from-blue-500 to-blue-600'
      },
      { 
        key: 'Routes', 
        icon: <TbRouteScan />, 
        label: 'Routes', 
        path: '/stationAdmin/Routes',
        color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
      },
      { 
        key: 'Dispachers', 
        icon: <BsPersonRolodex />, 
        label: 'Dispachers', 
        path: '/stationAdmin/Dispachers',
        color: 'bg-gradient-to-r from-teal-500 to-cyan-600'
      },
      { 
        key: 'TaxiAssignment', 
        icon: <LiaTaxiSolid />, 
        label: 'Taxi Assignment', 
        path: '/stationAdmin/TaxiAssignment',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600'
      },
      { 
        key: 'Reports', 
        icon: <TbReportAnalytics />, 
        label: 'Reports', 
        path: '/stationAdmin/Reports',
        color: 'bg-gradient-to-r from-orange-500 to-amber-600'
      },
    ]
  };

  const menuItems = menuConfig[role];

  // Get current active menu item
  const activeMenuItem = useMemo(() => {
    const path = location.pathname;
    return menuItems.find(item => path.includes(item.key)) || menuItems[0];
  }, [location.pathname, menuItems]);

  // Breadcrumb items based on current route
  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const menuItem = menuItems.find(item => item.path === path);
      return {
        title: menuItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: menuItem?.path || path
      };
    });
  }, [location.pathname, menuItems]);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <TbUserCircle className="text-lg" />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <BsGear className="text-lg" />,
      label: 'Account Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <CiLogout className="text-lg" />,
      label: 'Logout',
      danger: true,
      onClick: () => {
        // Handle logout logic
        navigate('/');
      },
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Header navigation items (visible on desktop)
  const headerNavItems = menuItems.filter(item => item.key !== activeMenuItem.key);

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
    }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={260}
        className="!bg-white shadow-xl"
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          borderRight: '1px solid #e2e8f0',
          transition: 'all 0.3s ease',
        }}
        trigger={null}
      >
        {/* Logo/Brand Section */}
        <div className={`flex flex-col items-center py-8 border-b border-gray-100 ${collapsed ? 'px-4' : 'px-6'}`}>
          {!collapsed ? (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform">
                <LiaTaxiSolid className="text-3xl text-white" />
              </div>
              <h2 className="text-gray-800 font-bold text-xl mb-1">Taxi Admin</h2>
              <div className="flex items-center gap-2">
                <Tag color={role === 'admin' ? 'blue' : 'green'} className="capitalize">
                  {role}
                </Tag>
              </div>
            </>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <LiaTaxiSolid className="text-2xl text-white" />
            </div>
          )}
        </div>

        {/* Menu Section */}
        <Menu
          mode="inline"
          className="!bg-transparent !border-none mt-6 px-3"
          theme="light"
          inlineCollapsed={collapsed}
          selectedKeys={[activeMenuItem.key]}
          style={{ border: 'none' }}
        >
          {menuItems.map(item => (
            <Menu.Item 
              key={item.key} 
              icon={item.icon}
              onClick={() => navigate(item.path)}
              className={`
                !h-12 !rounded-xl !mb-2 !transition-all !duration-300 !text-gray-700
                hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-indigo-50 hover:!text-blue-700
                !flex !items-center
                ${item.key === activeMenuItem.key ? '!bg-gradient-to-r !from-blue-50 !to-indigo-50 !text-blue-700 !font-semibold !border-l-4 !border-blue-500' : ''}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-medium ${collapsed ? 'hidden' : ''}`}>
                  {item.label}
                </span>
                {!collapsed && item.key === activeMenuItem.key && (
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                )}
              </div>
            </Menu.Item>
          ))}
        </Menu>

        {/* User Profile Section at Bottom */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/90 backdrop-blur-sm ${collapsed ? 'px-3' : 'px-4'}`}>
          <Dropdown menu={{ items: userMenuItems }} placement="topRight" arrow>
            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Avatar 
                  size="default" 
                  className="!bg-gradient-to-br !from-blue-500 !to-indigo-600 !shadow-md"
                  icon={<TbUserCircle />}
                />
                {!collapsed && (
                  <div>
                    <p className="text-gray-800 text-sm font-medium m-0 capitalize">
                      {role === 'admin' ? 'Admin User' : 'Station Manager'}
                    </p>
                    <p className="text-gray-500 text-xs m-0">
                      {role === 'admin' ? 'System Administrator' : 'Station Administrator'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Dropdown>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ 
        marginLeft: collapsed ? (isMobile ? 0 : 80) : 260,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <Header 
          className="!bg-white !px-4 md:!px-6 !py-0 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm border-b border-gray-100"
          style={{
            backgroundColor: 'white',
            minHeight: 72,
            position: 'sticky',
            top: 0,
            zIndex: 999,
          }}
        >
          {/* Top Section */}
          <div className="flex items-center justify-between w-full md:w-auto py-3 md:py-0">
            <div className="flex items-center space-x-3">
              <div 
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all cursor-pointer shadow-sm hover:shadow"
              >
                {collapsed ? (
                  <MenuUnfoldOutlined className="text-gray-700 text-lg" />
                ) : (
                  <MenuFoldOutlined className="text-gray-700 text-lg" />
                )}
              </div>
              
              <div className="hidden md:block">
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 m-0">
                 
                  {role === 'admin' ? 'WELCOME Admin!' : 'WELCOME Station Admin!'}
                </h1>
                <p className="text-gray-500 text-xs md:text-sm m-0">
                  {role === 'admin' ? 'Manage your transportation system' : 'Oversee station operations'}
                </p>
              </div>
            </div>

            {/* Mobile Title */}
            

            {/* User Profile - Mobile */}
            {/* <div className="md:hidden">
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <Avatar 
                  size="default" 
                  className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !shadow-md cursor-pointer"
                >
                  {role === 'admin' ? 'A' : 'S'}
                </Avatar>
              </Dropdown>
            </div> */}
          </div>

          {/* Desktop Navigation & Controls */}
          <div className="hidden md:flex items-center space-x-6 w-full md:w-auto justify-end">
           

            {/* Notifications */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'notifications',
                    label: (
                      <div className="px-4 py-2">
                        <h4 className="font-semibold text-gray-800">Notifications</h4>
                        <p className="text-gray-500 text-sm">No new notifications</p>
                      </div>
                    ),
                  },
                ]
              }}
              placement="bottomRight"
              arrow
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all cursor-pointer shadow-sm">
                <BsBell className="text-gray-600 text-lg" />
              </div>
            </Dropdown>

            {/* User Profile */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all group">
                <div className="relative">
                  <Avatar 
                    size="default" 
                    className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !shadow-md group-hover:scale-105 transition-transform"
                  >
                    {role === 'admin' ? 'A' : 'S'}
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 m-0 capitalize">
                    {role === 'admin' ? 'Admin User' : 'Station Manager'}
                  </p>
                  <p className="text-xs text-gray-500 m-0">
                    {role === 'admin' ? 'System Administrator' : 'Station Administrator'}
                  </p>
                </div>
              </div>
            </Dropdown>
          </div>

          {/* Mobile Navigation Pills */}
          {/* <div className="md:hidden w-full mt-3 pb-3 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              {headerNavItems.slice(0, 4).map(item => (
                <div
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 text-xs font-medium cursor-pointer transition-all duration-300 flex items-center space-x-1.5"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div> */}
        </Header>

        {/* Main Content */}
        <Content 
          className="p-4 md:p-6"
          style={{
            backgroundColor: 'transparent',
            minHeight: 'calc(100vh - 72px)',
          }}
        >
          {/* Mobile Breadcrumb */}
          <div className="md:hidden mb-4">
            <Breadcrumb>
              <Breadcrumb.Item>
                <span className="text-gray-600 text-sm capitalize">{role}</span>
              </Breadcrumb.Item>
              {breadcrumbItems.slice(-2).map((item, index) => (
                <Breadcrumb.Item key={index}>
                  <span 
                    className="text-gray-700 text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => navigate(item.path)}
                  >
                    {item.title}
                  </span>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>

          {/* Content Container */}
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-120px)] p-4 md:p-6"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            {/* Active Menu Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-8 rounded-lg ${activeMenuItem.color}`}></div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 m-0">
                    {activeMenuItem.label}
                  </h2>
                  <p className="text-gray-500 text-sm m-0 hidden md:block">
                    {role === 'admin' ? 'Manage all system operations' : 'Handle station-specific tasks'}
                  </p>
                </div>
              </div>
              <Tag color={role === 'admin' ? 'blue' : 'green'} className="capitalize text-xs md:text-sm">
                {role}
              </Tag>
            </div>

            <Outlet />
          </div>

        </Content>
      </Layout>

      {/* Mobile Overlay */}
      {!collapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-900"
          onClick={() => setCollapsed(true)}
          style={{ zIndex: 999 }}
        />
      )}
    </Layout>
  );
}
