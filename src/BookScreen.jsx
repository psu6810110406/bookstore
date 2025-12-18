import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin } from 'antd';
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

  const handleAddBook = async (book) => {
    setLoading(true);
    try { await axios.post(URL_BOOK, book); fetchBooks(); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }

  const handleLikeBook = async (book) => {
    try { await axios.patch(`${URL_BOOK}/${book.id}`, { likeCount: book.likeCount + 1 }); fetchBooks(); } 
    catch (error) { console.error(error); }
  }

  const handleDeleteBook = async (bookId) => {
    try { await axios.delete(`${URL_BOOK}/${bookId}`); fetchBooks(); } 
    catch (error) { console.error(error); }
  }

  const handleEditBook = async (book) => {
    setLoading(true);
    try {
      const {id, category, createdAt, updatedAt, ...data} = {...book, price: Number(book.price), stock: Number(book.stock)};
      await axios.patch(`${URL_BOOK}/${id}`, data);
      fetchBooks();
    } catch (error) { console.error(error); } 
    finally { setLoading(false); setEditBook(null); }
  }

  useEffect(() => { fetchCategories(); fetchBooks(); }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        <AddBook categories={categories} onBookAdded={handleAddBook}/>
      </div>
      <Divider>My Books List</Divider>
      <Spin spinning={loading}>
        <BookList 
          data={bookData} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          onEdit={book => setEditBook(book)}
        />
      </Spin>
      <EditBook 
        book={editBook} 
        categories={categories} 
        open={editBook !== null} 
        onCancel={() => setEditBook(null)} 
        onSave={handleEditBook} />
    </>
  )
}
export default BookScreen