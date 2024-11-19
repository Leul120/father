import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, Select, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppContext } from './App';

const SkillForm = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Save operation loading
  const [fetching, setFetching] = useState(true); // Fetching data loading
  const { token } = useContext(AppContext);

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

  const fetchSkills = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data.user.skills);
    } catch (error) {
      message.error('Failed to fetch skills');
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response=await axios.delete(`${process.env.REACT_APP_URL}/delete-skill/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      message.success('Skill deleted successfully');
      fetchSkills();
    } catch (error) {
      message.error('Failed to delete skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingSkill(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    console.log(editingSkill)
    const result = { skills: [values] };
    console.log(result.skills[0])
    try {
      if (editingSkill) {
        const response=await axios.put(
          `${process.env.REACT_APP_URL}/update-skill/${editingSkill._id}`,
          result.skills[0],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        message.success('Skill updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/post-skill`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Skill added successfully');
      }
      fetchSkills();
      setVisible(false);
      setEditingSkill(null);
    } catch (error) {
      message.error('Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 pt-3 h-full bg-stone-50 min-h-screen">
      <Card bordered={false} title="Skills">
        {fetching ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={skills}
              renderItem={(skill) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(skill)}
                    />,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(skill._id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={`${skill.skill}`}
                    description={`Level: ${skill.level}`}
                  />
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setVisible(true)}
              style={{ marginTop: 16 }}
            >
              Add Skill
            </Button>
          </>
        )}
      </Card>

      <Modal
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={editingSkill || { skill: '', level: '' }}
        >
          <Form.Item
            label="Skill"
            name="skill"
            rules={[{ required: true, message: 'Please enter the skill' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Level"
            name="level"
            rules={[{ required: true, message: 'Please select the skill level' }]}
          >
            <Select>
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
              <Select.Option value="Expert">Expert</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingSkill ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkillForm;
