import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, Skeleton, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const PublicationForm = () => {
  const [publications, setPublications] = useState([]);
  const [editingPublication, setEditingPublication] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    if (editingPublication) {
      form.setFieldsValue({
        ...editingPublication,
      });
    } else {
      form.resetFields();
    }
  }, [editingPublication, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchPublications = async () => {
    setFetching(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublications(response.data.user.publications);
    } catch (error) {
      setError('Failed to fetch publications. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const showDeleteConfirm = (publication) => {
    setPublicationToDelete(publication);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!publicationToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-publication/${publicationToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${publicationToDelete.title}" has been deleted successfully`);
      fetchPublications();
    } catch (error) {
      setError('Failed to delete publication. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setPublicationToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setPublicationToDelete(null);
  };

  const handleEdit = (pub) => {
    clearMessages();
    setEditingPublication(pub);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingPublication(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    const result = { publications: [values] };

    try {
      if (editingPublication) {
        await axios.put(
          `${apiUrl}/update-publication/${editingPublication._id}`,
          result.publications[0],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Publication updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-publication`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Publication added successfully');
      }
      fetchPublications();
      setVisible(false);
      setEditingPublication(null);
    } catch (error) {
      setError('Failed to save publication. Please check your connection and try again.');
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
              <span className="text-lg font-semibold">Publications Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Publication
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
            <>
              <List
                itemLayout="horizontal"
                dataSource={publications}
                locale={{
                  emptyText: (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-lg font-medium">No publications yet</div>
                      <div className="text-sm">Add your first publication to get started</div>
                    </div>
                  )
                }}
                renderItem={(pub) => (
                  <List.Item
                    className="hover:bg-gray-50 transition-colors duration-200"
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(pub)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Button>,
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(pub)}
                        className="text-red-600 hover:text-red-800"
                        danger
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div className="font-semibold text-gray-900">{pub.title}</div>
                      }
                      description={
                        <div className="space-y-1">
                          <div className="text-gray-600">
                            <strong>Journal:</strong> {pub.journal}
                          </div>
                          <div className="text-gray-600">
                            <strong>Volume:</strong> {pub.volume} | <strong>Pages:</strong> {pub.pages} | <strong>Year:</strong> {pub.year}
                          </div>
                          {pub.doi && (
                            <div className="text-gray-600">
                              <strong>DOI:</strong>{' '}
                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {pub.doi}
                              </a>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>

        {/* Add/Edit Publication Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingPublication ? 'Edit Publication' : 'Add New Publication'}
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
              editingPublication || {
                title: '',
                journal: '',
                volume: '',
                pages: '',
                year: '',
                url: '',
                doi: '',
              }
            }
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the publication title' }]}
            >
              <Input placeholder="Enter publication title" />
            </Form.Item>
            
            <Form.Item
              label="Journal"
              name="journal"
              rules={[{ required: true, message: 'Please enter the journal name' }]}
            >
              <Input placeholder="Enter journal name" />
            </Form.Item>
            
            <div className="grid grid-cols-3 gap-3">
              <Form.Item
                label="Volume"
                name="volume"
                rules={[{ required: true, message: 'Please enter the volume number' }]}
              >
                <Input placeholder="Vol." />
              </Form.Item>
              
              <Form.Item
                label="Pages"
                name="pages"
                rules={[{ required: true, message: 'Please enter the page numbers' }]}
              >
                <Input placeholder="pp. xx-xx" />
              </Form.Item>
              
              <Form.Item
                label="Year"
                name="year"
                rules={[
                  { required: true, message: 'Please enter the year of publication' },
                  {
                    validator: (_, value) => {
                      if (!value || (value >= 1900 && value <= new Date().getFullYear() + 1)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please enter a valid year'));
                    }
                  }
                ]}
              >
                <Input 
                  type="number" 
                  placeholder="Year"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
            </div>
            
            <Form.Item
              label="DOI"
              name="doi"
              rules={[{ required: true, message: 'Please enter the DOI' }]}
            >
              <Input placeholder="Enter DOI (e.g., 10.1234/example.doi)" />
            </Form.Item>
            
            <Form.Item
              label="URL"
              name="url"
              rules={[
                { required: true, message: 'Please enter the publication URL' },
                {
                  type: 'url',
                  message: 'Please enter a valid URL',
                }
              ]}
            >
              <Input placeholder="https://example.com/publication" />
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
                  {editingPublication ? 'Update Publication' : 'Add Publication'}
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
              Are you sure you want to delete this publication? This action cannot be undone.
            </p>
            {publicationToDelete && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="font-semibold text-gray-900">{publicationToDelete.title}</div>
                <div className="text-gray-600 text-sm">
                  {publicationToDelete.journal} • Volume {publicationToDelete.volume} • {publicationToDelete.year}
                </div>
                {publicationToDelete.doi && (
                  <div className="text-gray-600 text-sm mt-1">
                    DOI: {publicationToDelete.doi}
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

export default PublicationForm;