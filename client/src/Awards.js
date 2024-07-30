import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Link } from 'react-router-dom';

const AwardsForm = () => {
  const [awards, setAwards] = useState([]);
  const [editingAward, setEditingAward] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = window.localStorage.getItem('token');
  const decoded = jwtDecode(token);
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

  const fetchAwards = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/${decoded.id}`);
      setAwards(response.data.user.awards);
    } catch (error) {
      message.error('Failed to fetch awards');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/delete-award/${decoded.id}/${id}`);
      message.success('Award deleted successfully');
      fetchAwards();
    } catch (error) {
      message.error('Failed to delete award');
    }
  };

  const handleEdit = (award) => {
    setEditingAward(award);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingAward(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);

    try {
      if (editingAward) {
        await axios.put(`${process.env.REACT_APP_URL}/update-award/${decoded.id}/${editingAward._id}`, values);
        message.success('Award updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/post-award/${decoded.id}`, { awards: [values] });
        message.success('Award added successfully');
      }
      fetchAwards();
      setVisible(false);
      setEditingAward(null);
    } catch (error) {
      message.error('Failed to save award');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Awards">
        <List
          itemLayout="horizontal"
          dataSource={awards}
          renderItem={(award) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(award)}
                />,
                
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(award._id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={`${award.title}`}
                description={`${award.institution}, ${award.year}`}
              />
              <div>{award.description}</div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ marginTop: 16 }}
        >
          Add Award
        </Button>

      </Card>

      <Modal
        title={editingAward ? 'Edit Award' : 'Add Award'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
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
            label="Year"
            name="year"
            rules={[{ required: true, message: 'Please enter the year' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingAward ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AwardsForm;
