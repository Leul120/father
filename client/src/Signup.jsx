import{ useState } from "react";
import "tailwindcss/tailwind.css";
import { Button, Input, Form, Typography, notification } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const { Title, Text } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values) => {
    setLoading(true);
    console.log(values)
    try{
        const response=await axios.post(`${apiUrl}/signup`,values)
        console.log(response.data)
        window.localStorage.setItem('token',response.data.token)
    setTimeout(() => {
      setLoading(false);
      notification.success({
        message: "Signup Successful",
        description: "You have been signed up successfully!",
      });
    }, 2000);}catch(error){
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
          Sign Up
        </Title>
        <Form onFinish={handleSignup}>
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
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords that you entered do not match!');
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="w-full">
              Sign Up
            </Button>
          </Form.Item>
          <Text className="block text-center mt-4">
            Already have an account? <a href="/login" className="text-blue-500">Login</a>
          </Text>
        </Form>
      </motion.div>
    </div>
  );
};

export default Signup;
