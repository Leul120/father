import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { AppContext } from './App';

const CertificatesForm = () => {
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {token}=useContext(AppContext)
 
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (editingCertificate) {
      form.setFieldsValue(editingCertificate);
    } else {
      form.resetFields();
    }
  }, [editingCertificate, form]);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user`,{headers:{
        Authorization:`Bearer ${token}`
      }});
      setCertificates(response.data.user.certificates);
    } catch (error) {
      message.error('Failed to fetch certificates');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/user/delete-certificate/${id}`,{headers:{
        Authorization:`Bearer ${token}`
      }});
      message.success('Certificate deleted successfully');
      fetchCertificates();
    } catch (error) {
      message.error('Failed to delete certificate');
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingCertificate(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);

    try {
      if (editingCertificate) {
        await axios.put(`${process.env.REACT_APP_URL}/update-certificate/${editingCertificate._id}`, values,{headers:{
        Authorization:`Bearer ${token}`
      }});
        message.success('Certificate updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_URL}/post-certificate`, { certificates: [values] },{headers:{
        Authorization:`Bearer ${token}`
      }});
        message.success('Certificate added successfully');
      }
      fetchCertificates();
      setVisible(false);
      setEditingCertificate(null);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error('Failed to save certificate');
    } 
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Certificates">
        <List
          itemLayout="horizontal"
          dataSource={certificates}
          renderItem={(certificate) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(certificate)}
                />,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(certificate._id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={`${certificate.title}`}
                description={`${certificate.institution} - ${moment(certificate.date).format('YYYY')}`}
              />
              <div>{certificate.description}</div>
            </List.Item>
          )}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ marginTop: 16 }}
        >
          Add Certificate
        </Button>
      </Card>

      <Modal
        title={editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={editingCertificate || { title: '', institution: '', date: moment().format('YYYY-MM-DD'), description: '' }}
        >
          <Form.Item
            label="Certificate Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the certificate title' }]}
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
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please enter the date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingCertificate ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CertificatesForm;


