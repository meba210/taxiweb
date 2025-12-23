
// import { Button, Image } from "antd";
// import { useState } from "react";
// //import { useNavigate } from "react-router-dom";
// import Login from "../Components/modals/Login";

// export default function HomePage() {
//      //const navigate = useNavigate();
//       const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

//   const showLoginModal = () => {
//     setIsLoginModalOpen(true);
//   };

//   const closeLoginModal = () => {
//     setIsLoginModalOpen(false);
//   };
// // const handleLoginClick = () => {
// //   navigate("/login");
// // };
//   return (
//     <div className="bg-[url('/src/assets/homeBg.png')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
//       <header className="flex justify-between  bg-transparent px-10 py-6 shadow-none">
//         <Image src="/src/assets/taxi4.png" preview={false} width={140} />
//         <Button type="default" className="text-blue-600 border-blue-600 rounded-full px-6">
//           Contact Support
//         </Button>
//       </header>

     
//       <div className="flex flex-1 items-center justify-center px-4">
//         <div className="bg-white/40 backdrop-blur-[2px] border-4 border-blue-400 rounded-3xl p-12 max-w-3xl w-150 h-100 text-center shadow-lg">

//           <h1 className="text-blue-900 text-4xl font-extrabold leading-tight mb-4 mt-6">
//             Welcome to TaxiLink<br />TaxiLink Admin Portal
//           </h1>

//           <p className="text-blue-800 text-lg mb-8 mt-8 opacity-90">
//             See the City,Control the Network!
//           </p>

//           <Button
//             type="primary"
//             className="px-20 py-3 text-lg rounded-lg font-semibold w-50 h-30 mt-15"
//             onClick={showLoginModal}
//           >
//             Login
//           </Button>
//           {isLoginModalOpen && <Login isModalOpen={isLoginModalOpen} handleCancel={closeLoginModal} />}
//         </div>
//       </div>

  
//       <footer className="bg-blue-900 text-white py-4 text-center text-sm flex justify-center gap-8">
//         <span>© 2025 TaxiLink</span>
//         <span>Privacy Policy</span>
//         <span>Terms of Service</span>
//       </footer>
//     </div>
//   );
// }

 import { Button, Image, Typography, Space, Row, Col } from "antd";
import { useState, useEffect, useRef } from "react";
import { 
  PlayCircleOutlined,
  DashboardOutlined,
  CarOutlined,
  TeamOutlined,
  LineChartOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  CloudOutlined
} from "@ant-design/icons";
import Login from "../Components/modals/Login";

const { Title, Text } = Typography;

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [taxiPosition, setTaxiPosition] = useState(-100);
  const [direction, setDirection] = useState(1);
  const [hasCompletedTrip, setHasCompletedTrip] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
    
    // One-trip left-to-right animation
    let position = -100;
    let currentDirection = 1;
    let tripCompleted = false;
    
    const animateTaxi = () => {
      if (!tripCompleted) {
        position += currentDirection * 3;
        
        // Move from left to right
        if (position >= 100) {
          tripCompleted = true;
          setHasCompletedTrip(true);
          // Don't stop, just stay at the right side
          position = 100;
        }
        
        setTaxiPosition(position);
        setDirection(currentDirection);
      }
      
      animationRef.current = requestAnimationFrame(animateTaxi);
    };
    
    animationRef.current = requestAnimationFrame(animateTaxi);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
    <header className="px-6 lg:px-16 py-8 lg:py-10 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Logo Section - Larger and More Prominent */}
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="relative">
          <Image 
            src="/src/assets/taxi4.png" 
            preview={false} 
            width={70}
            height={70}
            className="drop-shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
            }}
          />
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="text-left">
          <Title 
            level={2} 
            className="mb-0 text-blue-900 font-bold text-3xl lg:text-4xl bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent"
          >
            TaxiLink
          </Title>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
            <Text className="text-blue-600 font-semibold text-sm lg:text-base">
              Admin Portal
            </Text>
          </div>
        </div>
      </div>

      {/* Action Buttons - Moved to Top */}
      <div className="flex items-center gap-4">
      
        
        <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
        
        <Button
          type="primary"
          size="large"
          className="px-6 py-2 h-auto font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            border: 'none'
          }}
          onClick={showLoginModal}
        >
          <Space>
            <ArrowRightOutlined />
            <span className="font-bold">Admin Login</span>
          </Space>
        </Button>
      </div>
    </div>
  </div>
</header>

      {/* Main Hero Section */}
      <main className="px-6 lg:px-16 py-8 lg:py-20">
        <Row 
          gutter={[64, 64]} 
          align="middle"
          className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Left Column - Content */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" className="w-full">
              {/* Professional Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-blue-100">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full animate-pulse"></div>
                <Text className="text-blue-700 font-semibold text-sm">
                  <CloudOutlined className="mr-2" />
                  TaxiLink
                </Text>
              </div>

              {/* Main Title with Animation */}
              <div className="space-y-6">
                <Title level={1} className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="text-blue-900">Intelligent</span>
                  <br />
                  <span className="text-blue-600">Transport Management</span>
                </Title>
                
                {/* Professional Description */}
                <Text className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Advanced analytics and real-time control for modern urban mobility. 
                  Monitor passenger flow, optimize taxi dispatch, and streamline station 
                  operations with our enterprise-grade dashboard.
                </Text>
              </div>

              {/* Feature Icons */}
              <div className="flex flex-wrap gap-6 py-4">
                {[
                  { icon: <DashboardOutlined className="text-2xl" />, label: "Live Dashboard" },
                  { icon: <CarOutlined className="text-2xl" />, label: "Fleet Control" },
                  { icon: <TeamOutlined className="text-2xl" />, label: "Passenger Analytics" },
                  { icon: <LineChartOutlined className="text-2xl" />, label: "Real-time Reports" },
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-blue-50 min-w-[100px]"
                  >
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-2">
                      <span className="text-blue-600">{feature.icon}</span>
                    </div>
                    <Text className="text-blue-800 font-medium text-xs text-center">{feature.label}</Text>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <Space wrap className="pt-6">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-10 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
                  style={{ 
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', 
                    border: 'none' 
                  }}
                  onClick={showLoginModal}
                  icon={<ArrowRightOutlined className="group-hover:translate-x-1 transition-transform duration-300" />}
                  iconPosition="end"
                >
                  Access Admin Dashboard
                </Button>
                
                <Button
                  size="large"
                  className="h-14 px-8 text-base font-semibold rounded-xl border-blue-200 bg-white hover:border-blue-400 hover:text-blue-700 transition-all duration-300 hover:shadow-md"
                  icon={<PlayCircleOutlined />}
                  onClick={() => window.open('#', '_blank')}
                >
                  Platform Tour
                </Button>
              </Space>
            </Space>
          </Col>

          {/* Right Column - Animated Taxi */}
        <Col xs={24} lg={12} className="bg-transparent">
  {/* <div className="relative h-full min-h-[500px] rounded-2xl shadow-xl border border-blue-100 overflow-hidden flex items-center justify-center bg-transparent"> */}
    
    {/* Only the moving taxi image */}
    <div 
      className="transition-all duration-75 ease-linear"
      style={{ 
        transform: `translateX(${taxiPosition}px)`,
        width: '70%',
        maxWidth: '600px'
      }}
    >
      <Image
        src="/src/assets/taxi2.png"
        alt="TaxiLink Management Dashboard"
        preview={false}
        className="w-full h-auto max-w-[450px] mx-auto"
        // style={{
        //   filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.1))"
        // }}
      />
    </div>
    
  {/* </div> */}
</Col>
        </Row>

        {/* Bottom Features */}
        <div className={`mt-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <SafetyCertificateOutlined className="text-blue-600 text-2xl" />
                </div>
                <Title level={4} className="text-blue-800 mb-3">Enterprise Security</Title>
                <Text className="text-gray-600">
                  Bank-level encryption and role-based access control for maximum protection.
                </Text>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <LineChartOutlined className="text-blue-600 text-2xl" />
                </div>
                <Title level={4} className="text-blue-800 mb-3">Real-time Analytics</Title>
                <Text className="text-gray-600">
                  Live data visualization and predictive insights for better decision making.
                </Text>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <CloudOutlined className="text-blue-600 text-2xl" />
                </div>
                <Title level={4} className="text-blue-800 mb-3">Cloud Native</Title>
                <Text className="text-gray-600">
                  Scalable infrastructure with automatic updates and 99.9% uptime guarantee.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Light Blue Background */}
      <footer className="mt-20 px-6 lg:px-16 py-12 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <Image 
                src="/src/assets/taxi4.png" 
                preview={false} 
                width={40}
                className="drop-shadow-sm"
              />
              <div>
                <Title level={4} className="mb-0 text-blue-800">TaxiLink</Title>
                <Text className="text-blue-600 text-sm">Transport Management System</Text>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <Text className="text-blue-700 font-semibold mb-2 block">Platform</Text>
                <div className="space-y-1">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">Documentation</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">API Reference</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">System Status</a>
                </div>
              </div>
              
              <div className="text-center">
                <Text className="text-blue-700 font-semibold mb-2 block">Company</Text>
                <div className="space-y-1">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">Privacy Policy</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">Terms of Service</a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm block transition-colors">Contact Support</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-200 mt-8 pt-8 text-center">
            <Text className="text-blue-600 text-sm">
              © 2025 TaxiLink Technologies. All rights reserved. 
              <span className="text-blue-500"> • </span>
              Enterprise-Grade Platform
            </Text>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && <Login isModalOpen={isLoginModalOpen} handleCancel={closeLoginModal} />}

      {/* Animation Styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>
    </div>
  );
}