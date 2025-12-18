import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Row, Col, Card, Statistic, Input, Button, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios'
import BookList from './components/BookList'
import AddBook from './components/AddBook'
import EditBook from './components/EditBook'

const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

function BookScreen() { 
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'edit'
  const [currentBook, setCurrentBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data.map(cat => ({ label: cat.name, value: cat.id })));
    } catch (error) { console.error(error); }
  }

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }

  useEffect(() => { fetchCategories(); fetchBooks(); }, []);

  const onActionComplete = (msg) => {
    message.success(msg);
    fetchBooks();
    setViewMode('list');
    setCurrentBook(null);
  };

  const handleLikeBook = async (book) => {
    try {
      await axios.patch(`${URL_BOOK}/${book.id}`, { likeCount: (book.likeCount || 0) + 1 });
      fetchBooks();
    } catch (error) { message.error("Like ไม่สำเร็จ"); }
  }

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${URL_BOOK}/${bookId}`);
      message.success("Deletebook successful");
      fetchBooks();
    } catch (error) { message.error("Deletebook failed"); }
  }

  const filteredBooks = bookData.filter(book => {
    const lowerSearch = searchTerm.toLowerCase();
    return (book.title?.toLowerCase().includes(lowerSearch) || book.author?.toLowerCase().includes(lowerSearch));
  });


  if (viewMode === 'add') {
  return (
    <div style={{ padding: '20px' }}>
      {/* เพิ่ม size="large" และปรับความสูง/ฟอนต์ใน style */}
      <Button 
        size="large" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setViewMode('list')} 
        style={{ marginBottom: 20, height: 50, fontSize: 16 }}
      >
        Return to homepage
      </Button>
      <AddBook categories={categories} onBookAdded={() => onActionComplete("Book added successfully!")} onCancel={() => setViewMode('list')} />
    </div>
  );
}

if (viewMode === 'edit') {
  return (
    <div style={{ padding: '20px' }}>
      {/* ทำเหมือนกันกับหน้า edit */}
      <Button 
        size="large" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => setViewMode('list')} 
        style={{ marginBottom: 20, height: 50, fontSize: 16 }}
      >
        Return to homepage
      </Button>
      <EditBook book={currentBook} categories={categories} onSave={() => onActionComplete("Data successfully corrected!")} onCancel={() => setViewMode('list')} />
    </div>
  );
}

 return (
  <div style={{ padding: '20px' }}>
    {/* แถวที่ 1: แถบค้นหา (ยาวเต็มหน้า) */}
    <Row style={{ marginBottom: '20px' }}>
      <Col span={24}>
        <Input.Search 
          placeholder="Search book title or author..." 
          size="large" 
          enterButton 
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </Col>
    </Row>

    {/* แถวที่ 2: ปุ่มเพิ่มหนังสือ (ซ้ายสุด) - กล่องจำนวนหนังสือ (กลาง) - กล่องจำนวนไลค์ (ขวา) */}
    <Row gutter={[16, 16]} align="middle" justify="center" style={{ marginBottom: '30px' }}>
      
      {/* 1. ปุ่มเพิ่มหนังสือ (มาแทนที่กล่องจำนวนหนังสือเดิม) */}
      <Col xs={24} sm={10} md={8}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setViewMode('add')}
          style={{ 
            height: '60px', 
            width: '100%', 
            fontSize: '18px', 
            fontWeight: 'bold',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(24, 144, 255, 0.3)' 
          }}
        >
          Add Book
        </Button>
      </Col>

      {/* 2. กล่องจำนวนหนังสือ (ย้ายมาอยู่ตรงกลาง) */}
      <Col xs={12} sm={6} md={5}>
        <Card variant="default" styles={{ body: { padding: '12px', textAlign: 'center' } }}>
          <Statistic 
            title="Number of books" 
            value={bookData.length} 
            valueStyle={{ fontSize: '20px', color: '#1460c9ff'  }} 
          />
        </Card>
      </Col>

      {/* 3. กล่องจำนวนไลค์ (อยู่ขวาสุดเหมือนเดิม) */}
      <Col xs={12} sm={6} md={5}>
        <Card variant="default" styles={{ body: { padding: '12px', textAlign: 'center' } }}>
          <Statistic 
            title="Total number of likes" 
            value={bookData.reduce((s, b) => s + (b.likeCount || 0), 0)} 
            valueStyle={{ fontSize: '20px', color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>

    <Divider orientation="center">My Book List</Divider>

    <Spin spinning={loading}>
      <BookList 
        data={filteredBooks} 
        onLiked={handleLikeBook}
        onDeleted={handleDeleteBook}
        onEdit={(book) => { 
          setCurrentBook(book); 
          setViewMode('edit'); 
        }} 
      />
    </Spin>
  </div>
);
}

export default BookScreen;