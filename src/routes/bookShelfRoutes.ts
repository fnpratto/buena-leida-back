import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
  removeBookFromBookshelf,
} from '../controllers/bookShelfController'; // Adjust the import path as necessary

const router = express.Router();

// Library routes
router.post('/', createBookShelf);
router.post('/add-book', addBookToBookshelf);
router.get('/:id_usuario', getUserBookshelves);
router.delete('/remove_book', removeBookFromBookshelf);

export default router;
