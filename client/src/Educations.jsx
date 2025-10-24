import { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, InputNumber, Skeleton, Alert, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const EducationForm = () => {
  const [educationList, setEducationList] = useState([]);
  const [editingEducation, setEditingEducation] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (editingEducation) {
      form.setFieldsValue({
        ...editingEducation,
        // Convert to YYYY-MM-DD format for native date input
        graduationDate: editingEducation.graduationDate ? 
          moment(editingEducation.graduationDate).format('YYYY-MM-DD') : ''
      });
    } else {
      form.resetFields();
    }
  }, [editingEducation, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchEducation = async () => {
    setSkeletonLoading(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEducationList(response.data.user?.educations.map(edu => ({
        ...edu,
        graduationDate: moment(edu.graduationDate),
      })));
    } catch (error) {
      setError('Failed to fetch education records. Please try again.');
    } finally {
      setSkeletonLoading(false);
    }
  };

  const showDeleteConfirm = (education) => {
    setEducationToDelete(education);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!educationToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-education/${educationToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${educationToDelete.degree}" has been deleted successfully`);
      fetchEducation();
    } catch (error) {
      setError('Failed to delete education record. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setEducationToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setEducationToDelete(null);
  };

  const handleEdit = (education) => {
    clearMessages();
    setEditingEducation(education);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingEducation(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    const result = { 
      educations: [{ 
        ...values, 
        graduationDate: values.graduationDate // Already in YYYY-MM-DD format from native input
      }] 
    };

    try {
      if (editingEducation) {
        await axios.put(`${apiUrl}/update-education/${editingEducation._id}`, result.educations[0], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Education record updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-education`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Education record added successfully');
      }
      fetchEducation();
      setVisible(false);
      setEditingEducation(null);
    } catch (error) {
      setError('Failed to save education record. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGpaColor = (gpa) => {
    if (gpa >= 3.7) return 'green';
    if (gpa >= 3.3) return 'blue';
    if (gpa >= 3.0) return 'orange';
    return 'red';
  };

  const formatGPA = (gpa) => {
    return parseFloat(gpa).toFixed(2);
  };

  const sortEducationByDate = (educationList) => {
    return [...educationList].sort((a, b) => moment(b.graduationDate).valueOf() - moment(a.graduationDate).valueOf());
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  return (
    <ProtectedRoute>
      <div className='px-3 pt-20 h-full bg-stone-50 min-h-screen'>
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Education Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Education
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

          {skeletonLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={sortEducationByDate(educationList)}
              locale={{
                emptyText: (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎓</div>
                    <div className="text-lg font-medium">No education records yet</div>
                    <div className="text-sm">Add your first education record to get started</div>
                  </div>
                )
              }}
              renderItem={(edu) => (
                <List.Item
                  className="hover:bg-gray-50 transition-colors duration-200"
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(edu)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Button>,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(edu)}
                      className="text-red-600 hover:text-red-800"
                      danger
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="font-semibold text-gray-900 text-lg">
                        {edu.degree} in {edu.field}
                      </div>
                    }
                    description={
                      <div className="space-y-2 mt-2">
                        <div className="text-gray-600">
                          <strong>Institution:</strong> {edu.institution}
                        </div>
                        <div className="text-gray-600">
                          <strong>Location:</strong> {edu.location}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-gray-600">
                            <strong>Graduated:</strong> {moment(edu.graduationDate).format('MMMM YYYY')}
                          </div>
                          <Tag color={getGpaColor(edu.gpa)} className="font-semibold">
                            GPA: {formatGPA(edu.gpa)}
                          </Tag>
                        </div>
                        {edu.thesis && (
                          <div className="text-gray-600">
                            <strong>Thesis:</strong> {edu.thesis}
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

        {/* Add/Edit Education Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingEducation ? 'Edit Education Record' : 'Add New Education Record'}
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
            initialValues={editingEducation || { 
              degree: '', 
              field: '', 
              institution: '', 
              location: '', 
              graduationDate: getTodayDate(), 
              gpa: 0, 
              thesis: '' 
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Degree"
                name="degree"
                rules={[{ required: true, message: 'Please enter the degree' }]}
              >
                <Input placeholder="e.g., Bachelor of Science" />
              </Form.Item>
              
              <Form.Item
                label="Field of Study"
                name="field"
              >
                <Input placeholder="e.g., Computer Science" />
              </Form.Item>
            </div>

            <Form.Item
              label="Institution"
              name="institution"
              rules={[{ required: true, message: 'Please enter the institution' }]}
            >
              <Input placeholder="e.g., University of Example" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: 'Please enter the location' }]}
              >
                <Input placeholder="e.g., City, Country" />
              </Form.Item>
              
              <Form.Item
                label="Graduation Date"
                name="graduationDate"
                rules={[{ required: true, message: 'Please select the graduation date' }]}
              >
                <Input 
                  type="date" 
                  className="w-full p-2 border border-gray-300 rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  max={getTodayDate()}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="GPA"
              name="gpa"
              rules={[
                { required: true, message: 'Please enter the GPA' },
                {
                  validator: (_, value) => {
                    if (value >= 0 && value <= 4.0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('GPA must be between 0 and 4.0'));
                  }
                }
              ]}
            >
              <InputNumber 
                min={0} 
                max={4} 
                step={0.1} 
                precision={2}
                placeholder="0.00 - 4.00"
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="Thesis / Dissertation"
              name="thesis"
            >
              <Input.TextArea 
                rows={3} 
                placeholder="Enter your thesis title or research topic (optional)"
                showCount 
                maxLength={200}
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
                  {editingEducation ? 'Update Education' : 'Add Education'}
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
              Are you sure you want to delete this education record? This action cannot be undone.
            </p>
            {educationToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="font-semibold text-gray-900 text-lg mb-2">
                  {educationToDelete.degree} in {educationToDelete.field}
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                  <div>{educationToDelete.institution}</div>
                  <div>{educationToDelete.location}</div>
                  <div className="flex items-center space-x-2">
                    <span>Graduated: {moment(educationToDelete.graduationDate).format('MMMM YYYY')}</span>
                    <Tag color={getGpaColor(educationToDelete.gpa)} size="small">
                      GPA: {formatGPA(educationToDelete.gpa)}
                    </Tag>
                  </div>
                  {educationToDelete.thesis && (
                    <div className="text-gray-500 italic">
                      Thesis: {educationToDelete.thesis}
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

export default EducationForm;