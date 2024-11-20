import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { AppContext } from './App';
const apiUrl = import.meta.env.VITE_API_URL;
const PublicationForm = () => {
  const [publications, setPublications] = useState([]);
  const [editingPublication, setEditingPublication] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Added fetching state
  const { token } = useContext(AppContext);

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

  const fetchPublications = async () => {
    setFetching(true); // Start fetching
    try {
      const response = await axios.get(`${apiUrl}/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublications(response.data.user.publications);
    } catch (error) {
      message.error('Failed to fetch publications');
    } finally {
      setFetching(false); // End fetching
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/delete-publication/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Publication deleted successfully');
      fetchPublications();
    } catch (error) {
      message.error('Failed to delete publication');
    }
  };

  const handleEdit = (pub) => {
    setEditingPublication(pub);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingPublication(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
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
        message.success('Publication updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-publication`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Publication added successfully');
      }
      fetchPublications();
      setVisible(false);
      setEditingPublication(null);
    } catch (error) {
      message.error('Failed to save publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-3 pt-3 h-full bg-stone-50 min-h-screen">
      <Card bordered={false} title="Publications">
        {fetching ? (
          <Skeleton active paragraph={{ rows: 4 }} /> // Skeleton during fetch
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={publications}
              renderItem={(pub) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(pub)}
                    />,
                    <Button
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(pub._id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={pub.title}
                    description={`Journal: ${pub.journal}, Volume: ${pub.volume}, Pages: ${pub.pages}, Year: ${pub.year}`}
                  />
                  <div>
                    DOI:{' '}
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {pub.doi}
                    </a>
                  </div>
                </List.Item>
              )}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setVisible(true)}
              style={{ marginTop: 16 }}
            >
              Add Publication
            </Button>
          </>
        )}
      </Card>

      <Modal
        title={editingPublication ? 'Edit Publication' : 'Add Publication'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
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
            <Input />
          </Form.Item>
          <Form.Item
            label="Journal"
            name="journal"
            rules={[{ required: true, message: 'Please enter the journal name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Volume"
            name="volume"
            rules={[{ required: true, message: 'Please enter the volume number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Pages"
            name="pages"
            rules={[{ required: true, message: 'Please enter the page numbers' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: 'Please enter the year of publication' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="DOI"
            name="doi"
            rules={[{ required: true, message: 'Please enter the DOI' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Please enter the publication URL' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingPublication ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PublicationForm;
