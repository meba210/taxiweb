
import { Button, Image } from "antd";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import Login from "../Components/modals/Login";

export default function HomePage() {
     //const navigate = useNavigate();
      const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };
// const handleLoginClick = () => {
//   navigate("/login");
// };
  return (
    <div className="bg-[url('/src/assets/homeBg.png')] bg-cover bg-center bg-no-repeat min-h-screen flex flex-col">
      <header className="flex justify-between  bg-transparent px-10 py-6 shadow-none">
        <Image src="/src/assets/taxi4.png" preview={false} width={140} />
        <Button type="default" className="text-blue-600 border-blue-600 rounded-full px-6">
          Contact Support
        </Button>
      </header>

     
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white/40 backdrop-blur-[2px] border-4 border-blue-400 rounded-3xl p-12 max-w-3xl w-150 h-100 text-center shadow-lg">

          <h1 className="text-blue-900 text-4xl font-extrabold leading-tight mb-4 mt-6">
            Welcome to TaxiLink<br />TaxiLink Admin Portal
          </h1>

          <p className="text-blue-800 text-lg mb-8 mt-8 opacity-90">
            See the City,Control the Network!
          </p>

          <Button
            type="primary"
            className="px-20 py-3 text-lg rounded-lg font-semibold w-50 h-30 mt-15"
            onClick={showLoginModal}
          >
            Login
          </Button>
          {isLoginModalOpen && <Login isModalOpen={isLoginModalOpen} handleCancel={closeLoginModal} />}
        </div>
      </div>

  
      <footer className="bg-blue-900 text-white py-4 text-center text-sm flex justify-center gap-8">
        <span>© 2025 TaxiLink</span>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </footer>
    </div>
  );
}
