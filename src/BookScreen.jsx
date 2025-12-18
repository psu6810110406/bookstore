import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin, Row, Col, Card, Statistic } from 'antd'; // เพิ่ม Card, Statistic
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
  const [editBook, setEditBook] = useState(null);

  // ... (ฟังก์ชัน fetch และ handle ต่างๆ เหมือนแบบที่ 1) ...
  const fetchCategories = async () => { /* ... */ }
  const fetchBooks = async () => { /* ... */ }
  const handleAddBook = async (book) => { /* ... */ }
  const handleLikeBook = async (book) => { /* ... */ }
  const handleDeleteBook = async (bookId) => { /* ... */ }
  const handleEditBook = async (book) => { /* ... */ }

  useEffect(() => { fetchCategories(); fetchBooks(); }, []);

  // เพิ่มส่วนการคำนวณสถิติ
  const totalBooks = bookData.length;
  const totalLikes = bookData.reduce((sum, book) => sum + (Number(book.likeCount) || 0), 0);

  return (
    <>
      {/* เพิ่มส่วนแสดงสถิติ */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card variant="default">
            <Statistic title="จำนวนหนังสือทั้งหมด" value={totalBooks} styles={{ content: { color: '#007bff' } }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="default">
            <Statistic title="จำนวนไลค์รวมทั้งหมด" value={totalLikes} styles={{ content: { color: '#cf1322' } }} />
          </Card>
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        <AddBook categories={categories} onBookAdded={handleAddBook}/>
      </div>
      <Divider>My Books List</Divider>
      <Spin spinning={loading}>
        <BookList data={bookData} onLiked={handleLikeBook} onDeleted={handleDeleteBook} onEdit={book => setEditBook(book)} />
      </Spin>
      <EditBook book={editBook} categories={categories} open={editBook !== null} onCancel={() => setEditBook(null)} onSave={handleEditBook} />
    </>
  )
}
export default BookScreen