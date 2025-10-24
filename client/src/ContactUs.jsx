import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert } from 'antd';
import { LoadingOutlined, MailOutlined, UserOutlined, PhoneOutlined, MessageOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const apiUrl = import.meta.env.VITE_API_URL;

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const submitData = async (data) => {
    try {
      setLoading(true);
      clearMessages();
      
      const response = await axios.post(`${apiUrl}/contact-us`, data);
      setLoading(false);
      setSuccess("Message sent successfully! I'll get back to you soon.");
      reset();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to send message. Please try again or contact me directly.");
    }
  };

  return (
    <div className="px-3 pt-20  pb-16 h-full bg-white min-h-screen font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-4xl font-bold text-gray-900 tracking-tight">
              Get In Touch
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
             Let's discuss how we can work together to bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card 
              bordered={false}
              className="bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300"
              bodyStyle={{ padding: '2rem' }}
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
                  className="mb-6 font-mono text-sm"
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
                  className="mb-6 font-mono text-sm"
                />
              )}

              <form onSubmit={handleSubmit(submitData)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 font-mono tracking-wide">
                      First Name *
                    </label>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            size="large"
                            placeholder="Enter your first name"
                            prefix={<UserOutlined className="text-gray-400" />}
                            className={`w-full font-mono text-sm ${errors.firstName ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
                            status={errors.firstName ? 'error' : ''}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-2 font-mono">{errors.firstName.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2 font-mono tracking-wide">
                      Last Name *
                    </label>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            size="large"
                            placeholder="Enter your last name"
                            prefix={<UserOutlined className="text-gray-400" />}
                            className={`w-full font-mono text-sm ${errors.lastName ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
                            status={errors.lastName ? 'error' : ''}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-xs mt-2 font-mono">{errors.lastName.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 font-mono tracking-wide">
                    Email Address *
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address"
                      }
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          size="large"
                          placeholder="your.email@example.com"
                          prefix={<MailOutlined className="text-gray-400" />}
                          className={`w-full font-mono text-sm ${errors.email ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
                          status={errors.email ? 'error' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-2 font-mono">{errors.email.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 font-mono tracking-wide">
                    Phone Number *
                  </label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ 
                      required: "Phone number is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Please enter a valid phone number"
                      }
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          size="large"
                          placeholder="+1 (555) 123-4567"
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          className={`w-full font-mono text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
                          status={errors.phoneNumber ? 'error' : ''}
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-2 font-mono">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2 font-mono tracking-wide">
                    Message *
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ 
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message should be at least 10 characters long"
                      }
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <Input.TextArea
                          {...field}
                          rows={5}
                          placeholder="Tell me about your project, opportunity, or how I can help you..."
                          className={`w-full font-mono text-sm ${errors.description ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}`}
                          status={errors.description ? 'error' : ''}
                          showCount
                          maxLength={1000}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-xs mt-2 font-mono">{errors.description.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <Button 
                    size="large"
                    onClick={() => {
                      clearMessages();
                      reset();
                    }}
                    disabled={loading}
                    className="font-mono border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    icon={loading ? <LoadingOutlined /> : <MessageOutlined />}
                    className="font-mono bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar - Contact Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card 
              bordered={false}
              className="bg-white border border-gray-200 shadow-sm rounded-xl"
              bodyStyle={{ padding: '1.5rem' }}
            >
              <h3 className="text-gray-900 font-semibold text-lg mb-4 font-mono tracking-wide">
                Contact Methods
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MailOutlined className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium font-mono text-sm">Email</div>
                    <div className="text-gray-500 text-xs font-mono">tirumelk@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PhoneOutlined className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium font-mono text-sm">Phone</div>
                    <div className="text-gray-500 text-xs font-mono">+251911054673</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageOutlined className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium font-mono text-sm">Response Time</div>
                    <div className="text-gray-500 text-xs font-mono">Within 24 hours</div>
                  </div>
                </div>
              </div>
            </Card>

            
            {/* Status Indicator */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="font-mono text-sm font-medium">Available for work</span>
              </div>
              <p className="text-blue-500 text-xs font-mono">
                Currently accepting new projects
              </p>
            </div>
          </div>
        </div>

        
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap');
        
        .font-mono {
          font-family: 'Victor Mono', monospace;
        }
        
        body {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;