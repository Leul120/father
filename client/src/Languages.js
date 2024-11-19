import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { AppContext } from './App';

const LanguageForm = () => {
  const [languages, setLanguages] = useState([]);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {token}=useContext(AppContext)
  
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (editingLanguage) {
      form.setFieldsValue({
        ...editingLanguage,
      });
    } else {
      form.resetFields();
    }
  }, [editingLanguage, form]);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`api/get-user`,{headers:{
        Authorization:`Bearer ${token}`
      }});
      setLanguages(response.data.user.languages);
    } catch (error) {
      message.error('Failed to fetch languages');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`api/delete-language/${id}`,{headers:{
        Authorization:`Bearer ${token}`
      }});
      message.success('Language deleted successfully');
      fetchLanguages();
    } catch (error) {
      message.error('Failed to delete language');
    }
  };

  const handleEdit = (lang) => {
    setEditingLanguage(lang);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingLanguage(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    const result = { languages: [values] };

    try {
      if (editingLanguage) {
        await axios.put(`api/update-language/${editingLanguage._id}`, result.languages[0],{headers:{
        Authorization:`Bearer ${token}`
      }});
        message.success('Language updated successfully');
      } else {
        await axios.post(`api/post-language`, result,{headers:{
        Authorization:`Bearer ${token}`
      }});
        message.success('Language added successfully');
      }
      fetchLanguages();
      setVisible(false);
      setEditingLanguage(null);
    } catch (error) {
      message.error('Failed to save language');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Languages">
        <List
          itemLayout="horizontal"
          dataSource={languages}
          renderItem={(lang) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(lang)}
                />,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(lang._id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={`${lang.language}`}
                description={`Proficiency: ${lang.proficiency}`}
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
          Add Language
        </Button>
      </Card>

      <Modal
        title={editingLanguage ? 'Edit Language' : 'Add Language'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={editingLanguage || { language: '', proficiency: '' }}
        >
          <Form.Item
            label="Language"
            name="language"
            rules={[{ required: true, message: 'Please enter the language' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Proficiency"
            name="proficiency"
            rules={[{ required: true, message: 'Please select the proficiency level' }]}
          >
            <Select>
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
              <Select.Option value="Native">Native</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingLanguage ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LanguageForm;
