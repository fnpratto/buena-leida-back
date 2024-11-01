import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
} from '../controllers/bookShelfController'; // Adjust the import path as necessary

const router = express.Router();

// Library routes
router.post('/', createBookShelf);
router.post('/add-book', addBookToBookshelf);


export default router;
