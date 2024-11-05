import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
  updateBookshelfFromBook,
} from '../controllers/bookShelfController';

const router = express.Router();

router.post('/', createBookShelf);
router.post('/addBook', addBookToBookshelf);
router.get('/:id_usuario', getUserBookshelves);
router.patch('/update-bookshelf/:id_libro', updateBookshelfFromBook);


export default router;
