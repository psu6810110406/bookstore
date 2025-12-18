import { Form, Input, InputNumber, Select, Button, Card, Space, Row, Col, message } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

export default function EditBook({ book, categories, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (book) {
      form.setFieldsValue(book);
    }
  }, [book, form]);

  const onFinish = async (values) => {
    try {
      const cleanData = {
        title: values.title,
        author: values.author,
        description: values.description,
        isbn: values.isbn, 
        price: Number(values.price), 
        stock: Number(values.stock),
        categoryId: values.categoryId,
        cover: values.cover
      };

      await axios.patch(`/api/book/${book.id}`, cleanData); 
      onSave();
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      const errorDetail = err.response?.data?.message || "The information is incorrect (Bad Request)";
      message.error(`Edit failed: ${errorDetail}`);
    }
  };

  return (
    <Card 
      title={`"Editing": ${book?.title}`} 
      variant="default" 
      style={{ maxWidth: 800, margin: '0 auto' }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="isbn" label="ISBN"><Input /></Form.Item>
        
        <Row gutter={16}>
          <Col span={8}><Form.Item name="price" label="Price"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
          <Col span={8}><Form.Item name="stock" label="Stock"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
          <Col span={8}>
            <Form.Item name="categoryId" label="categoryId">
              <Select options={categories} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="description"><Input.TextArea rows={4} /></Form.Item>
        <Form.Item name="cover" label="URL"><Input /></Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" size="large">Confirm the change</Button>
            <Button onClick={onCancel} size="large">Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}