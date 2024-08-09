import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { AppContext } from './App';

const UserProfileForm = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const {user}=useContext(AppContext)
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    form.setFieldsValue(userProfile);
  }, [userProfile, form]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/${user._id}`);
      setUserProfile(response.data.user);
    } catch (error) {
      message.error('Failed to fetch user profile');
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await axios.put(`${process.env.REACT_APP_URL}/update-user/${user._id}`, values);
      message.success('Profile updated successfully');
      fetchUserProfile();
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="User Profile">
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={userProfile}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Title"
            name="title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name={['contact', 'phone']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact Email"
            name={['contact', 'email']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name={['contact', 'address']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Institution"
            name={['contact', 'institution']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name={['contact', 'city']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Country"
            name={['contact', 'country']}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Summary"
            name="summary"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserProfileForm;
