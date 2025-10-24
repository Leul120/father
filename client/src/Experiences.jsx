import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, Skeleton, Alert, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (editingExperience) {
      form.setFieldsValue({
        ...editingExperience,
        // Convert to YYYY-MM-DD format for native date inputs
        startDate: editingExperience.startDate ? 
          moment(editingExperience.startDate).format('YYYY-MM-DD') : '',
        endDate: editingExperience.endDate ? 
          moment(editingExperience.endDate).format('YYYY-MM-DD') : ''
      });
    } else {
      form.resetFields();
    }
  }, [editingExperience, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchExperiences = async () => {
    setFetching(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExperiences(
        response.data.user.experiences.map((exp) => ({
          ...exp,
          startDate: moment(exp.startDate),
          endDate: exp.endDate ? moment(exp.endDate) : null,
        }))
      );
    } catch (error) {
      setError('Failed to fetch work experiences. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const showDeleteConfirm = (experience) => {
    setExperienceToDelete(experience);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!experienceToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-experience/${experienceToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${experienceToDelete.position}" at ${experienceToDelete.institution} has been deleted successfully`);
      fetchExperiences();
    } catch (error) {
      setError('Failed to delete work experience. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setExperienceToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setExperienceToDelete(null);
  };

  const handleEdit = (exp) => {
    clearMessages();
    setEditingExperience(exp);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingExperience(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    const result = {
      experiences: [
        {
          ...values,
          // Dates are already in YYYY-MM-DD format from native inputs
          startDate: values.startDate,
          endDate: values.endDate || null,
        },
      ],
    };

    try {
      if (editingExperience) {
        await axios.put(
          `${apiUrl}/update-experience/${editingExperience._id}`,
          result.experiences[0],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Work experience updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-experience`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Work experience added successfully');
      }
      fetchExperiences();
      setVisible(false);
      setEditingExperience(null);
    } catch (error) {
      setError('Failed to save work experience. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = moment(startDate);
    const end = endDate ? moment(endDate) : moment();
    
    const years = end.diff(start, 'years');
    const months = end.diff(start, 'months') % 12;
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`;
    }
  };

  const isCurrent = (endDate) => {
    return !endDate || moment(endDate).isAfter(moment());
  };

  const sortExperiencesByDate = (experiences) => {
    return [...experiences].sort((a, b) => moment(b.startDate).valueOf() - moment(a.startDate).valueOf());
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  return (
    <ProtectedRoute>
      <div className="px-3 pt-20 h-full bg-stone-50 min-h-screen">
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Work Experience Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Experience
              </Button>
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
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={sortExperiencesByDate(experiences)}
              locale={{
                emptyText: (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💼</div>
                    <div className="text-lg font-medium">No work experiences yet</div>
                    <div className="text-sm">Add your first work experience to get started</div>
                  </div>
                )
              }}
              renderItem={(exp) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors duration-200"
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(exp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(exp)}
                      className="text-red-600 hover:text-red-800"
                      danger
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">
                            {exp.position}
                          </div>
                          <div className="text-blue-600 font-medium">
                            {exp.institution}
                          </div>
                        </div>
                        <Tag 
                          color={isCurrent(exp.endDate) ? "green" : "blue"}
                          className="font-semibold"
                        >
                          {isCurrent(exp.endDate) ? "Current" : "Past"}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-2 mt-2">
                        <div className="text-gray-600">
                          <strong>Location:</strong> {exp.location}
                        </div>
                        <div className="text-gray-600">
                          <strong>Duration:</strong> {moment(exp.startDate).format('MMM YYYY')} - {' '}
                          {exp.endDate ? moment(exp.endDate).format('MMM YYYY') : 'Present'} 
                          {' '}({calculateDuration(exp.startDate, exp.endDate)})
                        </div>
                        {exp.description && (
                          <div className="text-gray-600 mt-2">
                            <strong>Description:</strong> {exp.description}
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        {/* Add/Edit Experience Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingExperience ? 'Edit Work Experience' : 'Add New Work Experience'}
            </div>
          }
          open={visible}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
          width={600}
        >
          <Form
            layout="vertical"
            onFinish={handleSave}
            form={form}
            initialValues={
              editingExperience ? {
                ...editingExperience,
                startDate: editingExperience.startDate ? 
                  moment(editingExperience.startDate).format('YYYY-MM-DD') : '',
                endDate: editingExperience.endDate ? 
                  moment(editingExperience.endDate).format('YYYY-MM-DD') : ''
              } : {
                position: '',
                institution: '',
                location: '',
                startDate: getTodayDate(),
                endDate: '',
                description: '',
              }
            }
          >
            <Form.Item
              label="Position / Job Title"
              name="position"
              rules={[{ required: true, message: 'Please enter the position' }]}
            >
              <Input placeholder="e.g., Senior Software Engineer" />
            </Form.Item>
            
            <Form.Item
              label="Company / Institution"
              name="institution"
              rules={[{ required: true, message: 'Please enter the institution' }]}
            >
              <Input placeholder="e.g., Google Inc." />
            </Form.Item>
            
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please enter the location' }]}
            >
              <Input placeholder="e.g., San Francisco, CA" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: 'Please select the start date' }]}
              >
                <Input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  max={getTodayDate()}
                />
              </Form.Item>
              
              <Form.Item 
                label="End Date" 
                name="endDate"
                help="Leave empty if this is your current position"
              >
                <Input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  max={getTodayDate()}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Description"
              name="description"
              help="Describe your responsibilities, achievements, and key contributions"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Describe your role, responsibilities, and key achievements..."
                showCount 
                maxLength={500}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingExperience ? 'Update Experience' : 'Add Experience'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <ExclamationCircleOutlined className="text-yellow-500 text-lg" />
              <span className="text-lg font-semibold">Confirm Deletion</span>
            </div>
          }
          open={deleteConfirmVisible}
          onCancel={handleCancelDelete}
          footer={[
            <Button key="no" onClick={handleCancelDelete}>
              No, Keep It
            </Button>,
            <Button 
              key="yes" 
              type="primary" 
              danger 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete It
            </Button>,
          ]}
          destroyOnClose
        >
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this work experience? This action cannot be undone.
            </p>
            {experienceToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="font-semibold text-gray-900 text-lg mb-2">
                  {experienceToDelete.position}
                </div>
                <div className="text-blue-600 font-medium mb-2">
                  {experienceToDelete.institution}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div><strong>Location:</strong> {experienceToDelete.location}</div>
                  <div>
                    <strong>Duration:</strong> {moment(experienceToDelete.startDate).format('MMM YYYY')} - {' '}
                    {experienceToDelete.endDate ? moment(experienceToDelete.endDate).format('MMM YYYY') : 'Present'}
                  </div>
                  <Tag 
                    color={isCurrent(experienceToDelete.endDate) ? "green" : "blue"}
                    size="small"
                  >
                    {isCurrent(experienceToDelete.endDate) ? "Current" : "Past"}
                  </Tag>
                  {experienceToDelete.description && (
                    <div className="text-gray-500 italic mt-2">
                      {experienceToDelete.description}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default ExperienceForm;