import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, Skeleton, Alert, Row, Col } from 'antd';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const UserProfileForm = () => {
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    form.setFieldsValue(userProfile);
  }, [userProfile, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchUserProfile = async () => {
    setFetching(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(response.data.user);
    } catch (error) {
      setError('Failed to fetch user profile. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    try {
      await axios.put(`${apiUrl}/update-user`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Profile updated successfully');
      fetchUserProfile();
    } catch (error) {
      setError('Failed to update profile. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="px-3 pt-20 h-full bg-stone-50 min-h-screen">
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Profile Information</span>
              <div className="text-sm text-gray-500">
                Manage your personal and professional details
              </div>
            </div>
          }
        >
          {/* Error Alert */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={clearMessages}
              className="mb-4"
            />
          )}

          {/* Success Alert */}
          {success && (
            <Alert
              message="Success"
              description={success}
              type="success"
              showIcon
              closable
              onClose={clearMessages}
              className="mb-4"
            />
          )}

          {fetching ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Form
              layout="vertical"
              onFinish={handleSave}
              form={form}
              initialValues={userProfile}
            >
              {/* Personal Information Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter your full name' }]}
                      tooltip="Your full name as you want it to appear on your profile"
                    >
                      <Input 
                        placeholder="Enter your full name" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Professional Title"
                      name="title"
                      tooltip="Your current job title or professional designation"
                    >
                      <Input 
                        placeholder="e.g., Senior Software Engineer" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Contact Information Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h3>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email Address"
                      name={['contact', 'email']}
                      rules={[
                        {
                          type: 'email',
                          message: 'Please enter a valid email address',
                        },
                      ]}
                    >
                      <Input 
                        placeholder="your.email@example.com" 
                        size="large"
                        type="email"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Phone Number"
                      name={['contact', 'phone']}
                    >
                      <Input 
                        placeholder="+1 (555) 123-4567" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Location Information Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Location Information
                </h3>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="City"
                      name={['contact', 'city']}
                    >
                      <Input 
                        placeholder="City name" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Country"
                      name={['contact', 'country']}
                    >
                      <Input 
                        placeholder="Country name" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Institution"
                      name={['contact', 'institution']}
                      tooltip="Your current company or educational institution"
                    >
                      <Input 
                        placeholder="Company or University" 
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Full Address"
                  name={['contact', 'address']}
                >
                  <Input.TextArea 
                    rows={2} 
                    placeholder="Enter your complete address"
                    showCount 
                    maxLength={200}
                  />
                </Form.Item>
              </div>

              {/* Professional Summary Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Professional Summary
                </h3>
                <Form.Item
                  name="summary"
                  tooltip="A brief overview of your professional background, skills, and career objectives"
                >
                  <Input.TextArea 
                    rows={6} 
                    placeholder="Write a compelling professional summary that highlights your experience, skills, and career goals. This will be displayed on your public profile."
                    showCount 
                    maxLength={1000}
                  />
                </Form.Item>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  size="large" 
                  onClick={() => {
                    clearMessages();
                    form.resetFields();
                    form.setFieldsValue(userProfile);
                  }}
                >
                  Reset Changes
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Profile
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default UserProfileForm;