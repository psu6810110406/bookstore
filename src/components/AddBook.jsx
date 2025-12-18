import { Form, Input, InputNumber, Select, Button, Card, Space, Row, Col, message } from 'antd';
import axios from 'axios';

export default function AddBook({ categories, onBookAdded, onCancel }) {
  const onFinish = async (values) => {
    try {
      await axios.post("/api/book", values);
      onBookAdded();
    } catch (err) {
      message.error("Unable to add books");
    }
  };

  return (
    <Card title="Create a new book" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the book title' }]}><Input /></Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter the author name' }]}><Input /></Form.Item>
        <Form.Item name="description" label="Description"><Input.TextArea rows={4} /></Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="price" label="Price"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="stock" label="Stock"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
          </Col>
        </Row>

        <Form.Item name="categoryId" label="CtegoryId">
          <Select options={categories} placeholder="Select a category" />
        </Form.Item>
        
        <Form.Item name="cover" label="URL">
          <Input placeholder="Example: https://images.com/cover.jpg" />
        </Form.Item>
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" size="large">Save</Button>
            <Button onClick={onCancel} size="large">Cancle</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}