import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { Button, Input, Form, Typography, notification } from "antd";
import { motion } from "framer-motion";
import axios from "axios";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin =async (values) => {
    setLoading(true);
    try{
        const response=await axios.post(`${process.env.REACT_APP_URL}/login`,values)
        console.log(response.data)
        window.localStorage.setItem('token',response.data.token)
        window.localStorage.setItem('user',JSON.stringify(response.data.user))
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: "Login Successful",
        description: "You have logged in successfully!",
      });
    }, 2000);
}catch(error){
    console.log(error)
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title level={2} className="text-center mb-6">
          Login
        </Title>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Login
            </Button>
          </Form.Item>
          <Text className="block text-center mt-4">
            Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
          </Text>
        </Form>
      </motion.div>
    </div>
  );
};

export default Login;
