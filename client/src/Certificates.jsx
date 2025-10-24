import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, Skeleton, Alert, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const CertificatesForm = () => {
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (editingCertificate) {
      form.setFieldsValue({
        ...editingCertificate,
        // Convert the date to YYYY-MM-DD format for the native date input
        date: editingCertificate.date ? moment(editingCertificate.date).format('YYYY-MM-DD') : ''
      });
    } else {
      form.resetFields();
    }
  }, [editingCertificate, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchCertificates = async () => {
    setFetching(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCertificates(response.data.user.certificates);
    } catch (error) {
      setError('Failed to fetch certificates. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const showDeleteConfirm = (certificate) => {
    setCertificateToDelete(certificate);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!certificateToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-certificate/${certificateToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${certificateToDelete.title}" has been deleted successfully`);
      fetchCertificates();
    } catch (error) {
      setError('Failed to delete certificate. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setCertificateToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setCertificateToDelete(null);
  };

  const handleEdit = (certificate) => {
    clearMessages();
    setEditingCertificate(certificate);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingCertificate(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    try {
      if (editingCertificate) {
        await axios.put(
          `${apiUrl}/update-certificate/${editingCertificate._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Certificate updated successfully');
      } else {
        await axios.post(
          `${apiUrl}/post-certificate`,
          { 
            certificates: [values] 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Certificate added successfully');
      }
      fetchCertificates();
      setVisible(false);
      setEditingCertificate(null);
    } catch (error) {
      setError('Failed to save certificate. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortCertificatesByDate = (certificates) => {
    return [...certificates].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
  };

  const isRecentCertificate = (date) => {
    return moment(date).isAfter(moment().subtract(1, 'year'));
  };

  // Get today's date in YYYY-MM-DD format for the max attribute
  const getTodayDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  return (
    <ProtectedRoute>
      <div className="px-3 pt-3 h-full bg-stone-50 min-h-screen">
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Certificates Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Certificate
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
              dataSource={sortCertificatesByDate(certificates)}
              locale={{
                emptyText: (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📜</div>
                    <div className="text-lg font-medium">No certificates yet</div>
                    <div className="text-sm">Add your first certificate to get started</div>
                  </div>
                )
              }}
              renderItem={(certificate) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors duration-200"
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(certificate)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(certificate)}
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
                        <div className="font-semibold text-gray-900 text-lg">
                          {certificate.title}
                        </div>
                        {isRecentCertificate(certificate.date) && (
                          <Tag color="green" className="font-semibold">
                            Recent
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-2 mt-2">
                        <div className="text-gray-600">
                          <strong>Issued by:</strong> {certificate.institution}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-600">
                            <strong>Date Issued:</strong> {moment(certificate.date).format('MMMM YYYY')}
                          </div>
                          <Tag color="blue" className="font-semibold">
                            {moment(certificate.date).format('YYYY')}
                          </Tag>
                        </div>
                        {certificate.description && (
                          <div className="text-gray-600 mt-2">
                            <strong>Description:</strong> {certificate.description}
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

        {/* Add/Edit Certificate Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
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
              editingCertificate ? {
                ...editingCertificate,
                date: editingCertificate.date ? moment(editingCertificate.date).format('YYYY-MM-DD') : ''
              } : {
                title: '',
                institution: '',
                date: getTodayDate(),
                description: '',
              }
            }
          >
            <Form.Item
              label="Certificate Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the certificate title' }]}
            >
              <Input 
                placeholder="e.g., AWS Certified Solutions Architect" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              label="Issuing Institution"
              name="institution"
              rules={[{ required: true, message: 'Please enter the issuing institution' }]}
            >
              <Input 
                placeholder="e.g., Amazon Web Services, Google, Microsoft" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              label="Date Issued"
              name="date"
              rules={[{ required: true, message: 'Please select the issue date' }]}
            >
              <Input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                max={getTodayDate()}
              />
            </Form.Item>
            
            <Form.Item
              label="Description"
              name="description"
              help="Optional: Add details about the certificate, skills gained, or relevance"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Describe what this certificate represents, skills validated, or its relevance to your professional development..."
                showCount 
                maxLength={300}
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
                  {editingCertificate ? 'Update Certificate' : 'Add Certificate'}
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
              Are you sure you want to delete this certificate? This action cannot be undone.
            </p>
            {certificateToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="font-semibold text-gray-900 text-lg mb-2">
                  {certificateToDelete.title}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div><strong>Issued by:</strong> {certificateToDelete.institution}</div>
                  <div className="flex items-center space-x-2">
                    <span><strong>Date:</strong> {moment(certificateToDelete.date).format('MMMM YYYY')}</span>
                    <Tag color="blue" size="small">
                      {moment(certificateToDelete.date).format('YYYY')}
                    </Tag>
                    {isRecentCertificate(certificateToDelete.date) && (
                      <Tag color="green" size="small">Recent</Tag>
                    )}
                  </div>
                  {certificateToDelete.description && (
                    <div className="text-gray-500 italic mt-2">
                      {certificateToDelete.description}
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

export default CertificatesForm;