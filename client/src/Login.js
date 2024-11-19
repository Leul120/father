import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Form, Typography, notification } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./App";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useContext(AppContext);

  // Uncomment and adjust the useEffect for token-based redirection
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Use environment variable for API base URL
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        email: values.email,
        password: values.password
      });

      // Destructure and validate response
      const { token, user } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Secure storage with more robust method
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update context with token
      setToken(token);

      // Success notification
      notification.success({
        message: "Login Successful",
        description: "Welcome back!",
        duration: 2
      });

      // Navigate to home page
      navigate('/');
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Login failed. Please try again.';

      notification.error({
        message: "Login Error",
        description: errorMessage,
        duration: 3
      });

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 120, 
          damping: 10 
        }}
      >
        <Title 
          level={2} 
          className="text-center mb-6 text-gray-800"
        >
          Welcome Back
        </Title>
        <Form 
          layout="vertical" 
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { 
                required: true, 
                message: "Please enter your email!" 
              },
              { 
                type: 'email', 
                message: 'Please enter a valid email!' 
              }
            ]}
          >
            <Input 
              placeholder="Enter your email" 
              size="large" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { 
                required: true, 
                message: "Please enter your password!" 
              },
              { 
                min: 6, 
                message: 'Password must be at least 6 characters' 
              }
            ]}
          >
            <Input.Password 
              placeholder="Enter your password" 
              size="large" 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="w-full mt-4"
              size="large"
            >
              Log In
            </Button>
          </Form.Item>
          
            
        </Form>
      </motion.div>
    </div>
  );
};

export default Login;