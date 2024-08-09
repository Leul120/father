import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';
import { AppContext } from './App';

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user}=useContext(AppContext)
  
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (editingExperience) {
      form.setFieldsValue({
        ...editingExperience,
        startDate: moment(editingExperience.startDate),
        endDate: editingExperience.endDate ? moment(editingExperience.endDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingExperience, form]);

  const fetchExperiences = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/${user._id}`);
      setExperiences(response.data.user.experiences.map(exp => ({
        ...exp,
        startDate: moment(exp.startDate),
        endDate: exp.endDate ? moment(exp.endDate) : null,
      })));
    } catch (error) {
      message.error('Failed to fetch experiences');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete-experience/${user._id}/${id}`);
      message.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      message.error('Failed to delete experience');
    }
  };

  const handleEdit = (exp) => {
    setEditingExperience(exp);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingExperience(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    const result = { experiences: [{ ...values, startDate: values.startDate.format('YYYY-MM-DD'), endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null }] };
console.log(result.experiences[0])
    try {
      if (editingExperience) {
        await axios.put(`${process.env.REACT_APP_URL}/update-experience/${user._id}/${editingExperience._id}`, result.experiences[0]);
        message.success('Experience updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/post-experience/${user._id}`, result);
        message.success('Experience added successfully');
      }
      fetchExperiences();
      setVisible(false);
      setEditingExperience(null);
    } catch (error) {
      message.error('Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Work Experience">
        <List
          itemLayout="horizontal"
          dataSource={experiences}
          renderItem={(exp) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(exp)}
                />,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(exp._id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={`${exp.position} at ${exp.institution}`}
                description={`${exp.location}`}
              />
              <div>
                {moment(exp.startDate).format('YYYY-MM-DD')} - {exp.endDate ? moment(exp.endDate).format('YYYY-MM-DD') : 'Present'}
              </div>
              <div>{exp.description}</div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ marginTop: 16 }}
        >
          Add Experience
        </Button>
        
      </Card>

      <Modal
        title={editingExperience ? 'Edit Experience' : 'Add Experience'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={editingExperience || { position: '', institution: '', location: '', startDate: moment(), endDate: null, description: '' }}
        >
          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: 'Please enter the position' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Institution"
            name="institution"
            rules={[{ required: true, message: 'Please enter the institution' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Please enter the location' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: 'Please select the start date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingExperience ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExperienceForm;
