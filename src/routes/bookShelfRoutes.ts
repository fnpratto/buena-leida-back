import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
} from '../controllers/bookShelfController';

const router = express.Router();

router.post('/', createBookShelf);
router.post('/addBook', addBookToBookshelf);
router.get('/:id_usuario', getUserBookshelves);

export default router;
