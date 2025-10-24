import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, Modal, Select, Skeleton, Alert, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppContext } from './App';
import ProtectedRoute from './protected-route';

const apiUrl = import.meta.env.VITE_API_URL;

const SkillForm = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useContext(AppContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (editingSkill) {
      form.setFieldsValue({
        ...editingSkill,
      });
    } else {
      form.resetFields();
    }
  }, [editingSkill, form]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchSkills = async () => {
    setFetching(true);
    clearMessages();
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data.user.skills);
    } catch (error) {
      setError('Failed to fetch skills. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const showDeleteConfirm = (skill) => {
    setSkillToDelete(skill);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    
    clearMessages();
    try {
      await axios.delete(`${apiUrl}/delete-skill/${skillToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(`"${skillToDelete.skill}" has been deleted successfully`);
      fetchSkills();
    } catch (error) {
      setError('Failed to delete skill. Please try again.');
    } finally {
      setDeleteConfirmVisible(false);
      setSkillToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmVisible(false);
    setSkillToDelete(null);
  };

  const handleEdit = (skill) => {
    clearMessages();
    setEditingSkill(skill);
    setVisible(true);
  };

  const handleCancel = () => {
    clearMessages();
    setEditingSkill(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    clearMessages();
    const result = { skills: [values] };

    try {
      if (editingSkill) {
        await axios.put(
          `${apiUrl}/update-skill/${editingSkill._id}`,
          result.skills[0],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess('Skill updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-skill`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('Skill added successfully');
      }
      fetchSkills();
      setVisible(false);
      setEditingSkill(null);
    } catch (error) {
      setError('Failed to save skill. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'blue',
      'Intermediate': 'green',
      'Advanced': 'orange',
      'Expert': 'red'
    };
    return colors[level] || 'default';
  };

  const sortSkillsByLevel = (skills) => {
    const levelOrder = { 'Expert': 4, 'Advanced': 3, 'Intermediate': 2, 'Beginner': 1 };
    return [...skills].sort((a, b) => levelOrder[b.level] - levelOrder[a.level]);
  };

  return (
    <ProtectedRoute>
      <div className="px-3 pt-20 h-full bg-stone-50 min-h-screen">
        <Card 
          bordered={false} 
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Skills Management</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  clearMessages();
                  setVisible(true);
                }}
              >
                Add Skill
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
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={sortSkillsByLevel(skills)}
                locale={{
                  emptyText: (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🛠️</div>
                      <div className="text-lg font-medium">No skills yet</div>
                      <div className="text-sm">Add your first skill to get started</div>
                    </div>
                  )
                }}
                renderItem={(skill) => (
                  <List.Item
                    className="hover:bg-gray-50 transition-colors duration-200"
                    actions={[
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Button>,
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(skill)}
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
                          {skill.skill}
                        </div>
                      }
                      description={
                        <div className="flex items-center space-x-4 mt-2">
                          <Tag 
                            color={getLevelColor(skill.level)} 
                            className="font-semibold px-3 py-1 text-sm"
                          >
                            {skill.level}
                          </Tag>
                          <div className="text-gray-500 text-sm">
                            Proficiency Level
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>

        {/* Add/Edit Skill Modal */}
        <Modal
          title={
            <div className="text-lg font-semibold">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
            initialValues={editingSkill || { skill: '', level: '' }}
          >
            <Form.Item
              label="Skill Name"
              name="skill"
              rules={[{ required: true, message: 'Please enter the skill name' }]}
            >
              <Input 
                placeholder="Enter skill name (e.g., JavaScript, Project Management)" 
                size="large"
              />
            </Form.Item>
            
            <Form.Item
              label="Proficiency Level"
              name="level"
              rules={[{ required: true, message: 'Please select your proficiency level' }]}
            >
              <Select 
                size="large"
                placeholder="Select your skill level"
              >
                <Select.Option value="Beginner">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Beginner</span>
                  </div>
                </Select.Option>
                <Select.Option value="Intermediate">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Intermediate</span>
                  </div>
                </Select.Option>
                <Select.Option value="Advanced">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Advanced</span>
                  </div>
                </Select.Option>
                <Select.Option value="Expert">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Expert</span>
                  </div>
                </Select.Option>
              </Select>
            </Form.Item>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Proficiency Guide:</div>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Beginner:</strong> Basic understanding, limited experience</div>
                <div><strong>Intermediate:</strong> Comfortable with core concepts, some project experience</div>
                <div><strong>Advanced:</strong> Deep understanding, significant project experience</div>
                <div><strong>Expert:</strong> Mastery level, can mentor others, industry recognition</div>
              </div>
            </div>
            
            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel} size="large">
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="large"
                >
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
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
            <Button key="no" onClick={handleCancelDelete} size="large">
              No, Keep It
            </Button>,
            <Button 
              key="yes" 
              type="primary" 
              danger 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              size="large"
            >
              Yes, Delete It
            </Button>,
          ]}
          destroyOnClose
        >
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this skill? This action cannot be undone.
            </p>
            {skillToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="font-semibold text-gray-900 text-lg mb-2">
                  {skillToDelete.skill}
                </div>
                <div className="flex items-center space-x-3">
                  <Tag 
                    color={getLevelColor(skillToDelete.level)} 
                    className="font-semibold px-3 py-1"
                  >
                    {skillToDelete.level}
                  </Tag>
                  <span className="text-gray-600 text-sm">
                    Proficiency Level
                  </span>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default SkillForm;