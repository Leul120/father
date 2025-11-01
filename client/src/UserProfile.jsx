import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, Skeleton, Alert, Row, Col, Upload, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
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
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleProfilePictureUpload = async (file) => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setUploadingPicture(true);
    clearMessages();
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Debug: Verify FormData
      console.log('File being uploaded:', file.name, file.type, file.size);
      
      // Check what we're sending
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      // For FormData, we need to ensure axios doesn't transform it
      // The key is to NOT set Content-Type in headers - let browser/axios set it
      // Using axios PUT directly with minimal config
      const response = await axios.put(
        `${apiUrl}/update-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Explicitly DO NOT set Content-Type - browser must set it with boundary
          },
          // Override axios default transformRequest to preserve FormData
          transformRequest: [
            function (data, headers) {
              // If it's FormData, return it as-is without any transformation
              if (data instanceof FormData) {
                // Remove any manually set Content-Type header
                // Browser will automatically set it with the correct boundary
                if (headers && headers['Content-Type']) {
                  delete headers['Content-Type'];
                }
                return data; // Return FormData unchanged
              }
              // For non-FormData, use default JSON stringification
              return JSON.stringify(data);
            }
          ],
          // Handle response parsing
          transformResponse: [
            function (data) {
              try {
                return JSON.parse(data);
              } catch (e) {
                return data;
              }
            }
          ],
        }
      );
      
      console.log('Upload successful:', response.data);

      setSuccess('Profile picture updated successfully');
      setPreviewImage(null);
      setSelectedFile(null);
      // Refresh user profile to get updated picture
      fetchUserProfile();
      message.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.config?.headers);
      
      let errorMessage = 'Failed to update profile picture. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || 
                       error.response.data?.details || 
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setUploadingPicture(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    
    // Store the file
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSavePicture = () => {
    if (selectedFile) {
      handleProfilePictureUpload(selectedFile);
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
              {/* Profile Picture Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <Avatar
                      size={120}
                      src={previewImage || (userProfile?.profilePicture?.[0]?.imageUrl)}
                      icon={<UserOutlined />}
                      className="border-2 border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <Upload
                      name="profilePicture"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      accept="image/*"
                      maxCount={1}
                    >
                      <Button 
                        icon={<UploadOutlined />} 
                        size="large"
                        loading={uploadingPicture}
                      >
                        {previewImage ? 'Change Picture' : 'Upload Picture'}
                      </Button>
                    </Upload>
                    {previewImage && (
                      <div className="mt-3 flex items-center space-x-3">
                        <Button
                          type="primary"
                          size="middle"
                          onClick={handleSavePicture}
                          loading={uploadingPicture}
                        >
                          Save Picture
                        </Button>
                        <Button
                          size="middle"
                          onClick={handleRemove}
                          disabled={uploadingPicture}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or GIF. Max size: 5MB. Recommended: 400x400px
                    </p>
                  </div>
                </div>
              </div>

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