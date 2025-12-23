import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from "axios";

type FieldType = {
  UserName?: string;
  Password?: string;
  remember?: string;
};
type LoginPageProps = {
  isModalOpen: boolean;
  handleCancel: () => void;
   
};
const Login:  React.FC<LoginPageProps> = ({ isModalOpen, handleCancel}) => {
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 
   
//   const onSubmit = async (values: FieldType) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/auth/login",
//         values,
        
//       );
//     console.log("✅ Login response:", res.data);
       
//       message.success("✅ Login successful");
//  localStorage.setItem("token", res.data.token);
//       const role = res.data.role;

//       if (role === "admin") navigate("/admin");
//       else if (role === "stationAdmin") navigate("/stationAdmin");
//      else alert("Unknown role!");

//     } catch (error: any) {
//       message.error(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };
 
const onSubmit = async (values: FieldType) => {
  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/auth/login",
      values
    );

    console.log("✅ Login response:", res.data);

    const { token, role, userId, mustChangePassword } = res.data;

    // Store session
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (userId) localStorage.setItem("id", userId.toString());
    if (mustChangePassword !== undefined) {
      localStorage.setItem("mustChangePassword", String(mustChangePassword));
    }

    message.success("✅ Login successful");

    // 🔀 Role-based navigation
    if (role === "stationAdmin") {
      if (mustChangePassword) {
        navigate("/stationAdmin/changePassword");
      } else {
        navigate("/stationAdmin");
      }
    } 
    else if (role === "admin") {
      navigate("/admin");
    } 
    else {
      message.error("Unknown role!");
    }

  } catch (error: any) {
    message.error(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    
    <Modal
  open={isModalOpen}
  onCancel={handleCancel}
  footer={null}
  centered
  className="bg-white/40 backdrop-blur-md border-4 border-blue-400 rounded-3xl p-12 max-w-3xl w-full text-center shadow-lg"
>
  <h2 className="text-2xl font-bold text-blue-900 mb-6">Login</h2>
  <Form
    name="login"
    initialValues={{ remember: true }}
    onFinish={onSubmit}
    autoComplete="off"
    requiredMark={false}
  >
    <Form.Item<FieldType>
      label="Username"
      name="UserName"
      rules={[{ required: true, message: "Please input your username!" }]}
    >
      <Input className="border border-blue-300 rounded-md px-2 py-1 bg-white h-10" />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="Password"
      rules={[{ required: true, message: "Please input your password!" }]}
    >
      <Input.Password className="border border-blue-300 rounded-md px-2 py-1 h-10" />
    </Form.Item>

    {/* <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
      <Checkbox className="text-blue-700">Remember me</Checkbox>
    </Form.Item> */}

    <Form.Item label={null} className="text-center">
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="w-50 bg-blue-500 hover:bg-blue-600 border-none"
      >
        Submit
      </Button>
    </Form.Item>
  </Form>
</Modal>

  );
};

export default Login;


