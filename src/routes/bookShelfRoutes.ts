import express from 'express';
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
  removeBookFromBookshelf,
  updateBookshelfFromBook,
  getUserBookshelvesFromBook
} from '../controllers/bookShelfController'; // Adjust the import path as necessary

const router = express.Router();

router.post('/', createBookShelf);
router.post('/addBook', addBookToBookshelf);
router.get('/:used_id', getUserBookshelves);
router.delete('/remove_book', removeBookFromBookshelf);
router.patch('/update_bookshelf/:book_id', updateBookshelfFromBook);
router.get('/:user_id/saw_bookshelves', getUserBookshelvesFromBook);


export default router;
