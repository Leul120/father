import { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, Card, List, message, Modal, DatePicker, InputNumber, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from './App';
const apiUrl = import.meta.env.VITE_API_URL;
const EducationForm = () => {
  const [educationList, setEducationList] = useState([]);
  const [editingEducation, setEditingEducation] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const { token } = useContext(AppContext);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (editingEducation) {
      form.setFieldsValue({
        ...editingEducation,
        graduationDate: moment(editingEducation.graduationDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingEducation, form]);

  const fetchEducation = async () => {
    setSkeletonLoading(true);
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
      message.error('Failed to fetch education');
    } finally {
      setSkeletonLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/delete-education/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Education deleted successfully');
      fetchEducation();
    } catch (error) {
      message.error('Failed to delete education');
    }
  };

  const handleEdit = (education) => {
    setEditingEducation(education);
    setVisible(true);
  };

  const handleCancel = () => {
    setEditingEducation(null);
    setVisible(false);
  };

  const handleSave = async (values) => {
    setLoading(true);
    const result = { educations: [{ ...values, graduationDate: values.graduationDate.format('YYYY-MM-DD') }] };

    try {
      if (editingEducation) {
        await axios.put(`${apiUrl}/update-education/${editingEducation._id}`, result.educations[0], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Education updated successfully');
      } else {
        await axios.post(`${apiUrl}/post-education`, result, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Education added successfully');
      }
      fetchEducation();
      setVisible(false);
      setEditingEducation(null);
    } catch (error) {
      message.error('Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-3 pt-3 h-full bg-stone-50 min-h-screen'>
      <Card bordered={false} title="Education">
        {skeletonLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={educationList}
            renderItem={(edu) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(edu)}
                  />,
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(edu._id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={`${edu.degree} in ${edu.field}`}
                  description={`${edu.institution}, ${edu.location} (GPA: ${edu.gpa})`}
                />
                <div>Graduated: {moment(edu.graduationDate).format('YYYY-MM-DD')}</div>
                <div>Thesis: {edu.thesis}</div>
              </List.Item>
            )}
          />
        )}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ marginTop: 16 }}
        >
          Add Education
        </Button>
      </Card>

      <Modal
        title={editingEducation ? 'Edit Education' : 'Add Education'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
          initialValues={editingEducation || { degree: '', field: '', institution: '', location: '', graduationDate: moment(), gpa: 0, thesis: '' }}
        >
          <Form.Item
            label="Degree"
            name="degree"
            rules={[{ required: true, message: 'Please enter the degree' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Field"
            name="field"
            rules={[{ required: true, message: 'Please enter the field of study' }]}
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
            label="Graduation Date"
            name="graduationDate"
            rules={[{ required: true, message: 'Please select the graduation date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="GPA"
            name="gpa"
            rules={[{ required: true, message: 'Please enter the GPA' }]}
          >
            <InputNumber min={0} max={4} step={0.1} />
          </Form.Item>
          <Form.Item
            label="Thesis"
            name="thesis"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingEducation ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EducationForm;
