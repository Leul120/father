import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, Skeleton, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const AwardsForm = () => {
  const [awards, setAwards] = useState([]);
  const [loadingAwards, setLoadingAwards] = useState(true);
  const [editingAward, setEditingAward] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchAwards();
  }, []);

  useEffect(() => {
    if (editingAward) {
      form.setFieldsValue(editingAward);
    } else {
      form.resetFields();
    }
  }, [editingAward, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchAwards = async () => {
    setLoadingAwards(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAwards(response.data.user.awards);
    } catch (error) {
      setError('Failed to fetch awards. Please try again.');
    } finally {
      setLoadingAwards(false);
    }
  };

  const showDeleteConfirm = (award) => {
    setAwardToDelete(award);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!awardToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-award/${awardToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${awardToDelete.title}" has been deleted successfully`);
      fetchAwards();
    } catch (error) {
      setError('Failed to delete award. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setAwardToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setAwardToDelete(null);
  };

  const handleEdit = (award) => {
    clearMessages();
    setEditingAward(award);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingAward(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();

    try {
      if (editingAward) {
        await axios.put(`${apiUrl}/update-award/${editingAward._id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Award updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-award`, { awards: [values] }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Award added successfully');
      }
      fetchAwards();
      setVisible(false);
      setEditingAward(null);
    } catch (error) {
      setError('Failed to save award. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='px-3 pt-20 h-full bg-stone-50 min-h-screen'>
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Awards Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Award
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

          {loadingAwards ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={awards}
              locale={{
                emptyText: (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-lg font-medium">No awards yet</div>
                    <div className="text-sm">Add your first award to get started</div>
                  </div>
                )
              }}
              renderItem={(award) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors duration-200"
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(award)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(award)}
                      className="text-red-600 hover:text-red-800"
                      danger
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="font-semibold text-gray-900">{award.title}</div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="text-gray-600">
                          <strong>Institution:</strong> {award.institution}
                        </div>
                        <div className="text-gray-600">
                          <strong>Year:</strong> {award.year}
                        </div>
                        {award.description && (
                          <div className="text-gray-600 mt-2">
                            <strong>Description:</strong> {award.description}
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

        {/* Add/Edit Award Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingAward ? 'Edit Award' : 'Add New Award'}
            </div>
          }
          open={visible}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            onFinish={handleSave}
            form={form}
            initialValues={editingAward || { title: '', institution: '', year: moment().year(), description: '' }}
          >
            <Form.Item
              label="Award Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the award title' }]}
            >
              <Input placeholder="Enter award title" />
            </Form.Item>
            
            <Form.Item
              label="Institution"
              name="institution"
              rules={[{ required: true, message: 'Please enter the institution' }]}
            >
              <Input placeholder="Enter institution name" />
            </Form.Item>
            
            <Form.Item
              label="Year"
              name="year"
              rules={[
                { required: true, message: 'Please enter the year' },
                {
                  validator: (_, value) => {
                    if (!value || (value >= 1900 && value <= moment().year() + 5)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Please enter a valid year'));
                  }
                }
              ]}
            >
              <Input 
                type="number" 
                placeholder="Enter year" 
                min={1900}
                max={moment().year() + 5}
              />
            </Form.Item>
            
            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Enter award description (optional)"
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
                  {editingAward ? 'Update Award' : 'Add Award'}
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
              Are you sure you want to delete this award? This action cannot be undone.
            </p>
            {awardToDelete && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="font-semibold text-gray-900">{awardToDelete.title}</div>
                <div className="text-gray-600 text-sm">
                  {awardToDelete.institution} • {awardToDelete.year}
                </div>
                {awardToDelete.description && (
                  <div className="text-gray-600 text-sm mt-1">
                    {awardToDelete.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default AwardsForm;