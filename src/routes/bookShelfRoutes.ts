import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
} from '../controllers/bookShelfController'; // Adjust the import path as necessary

const router = express.Router();

// Library routes
router.post('/', createBookShelf);
router.post('/addBook', addBookToBookshelf);
router.get('/:id_usuario', getUserBookshelves);

export default router;
