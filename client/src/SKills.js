import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const SkillForm = () => {
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = window.localStorage.getItem('token');
  const decoded = jwtDecode(token);
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
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/${decoded.id}`);
      setSkills(response.data.user.skills);
    } catch (error) {
      message.error('Failed to fetch skills');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete-skill/${decoded.id}/${id}`);
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
    const result = { skills: [values] };

    try {
      if (editingSkill) {
        await axios.put(`${process.env.REACT_APP_URL}/update-skill/${decoded.id}/${editingSkill._id}`, result.skills[0]);
        message.success('Skill updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/post-skill${decoded.id}`, result);
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
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Skills">
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
