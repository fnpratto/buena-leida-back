import express from "express";
import {
  createBookShelf,
  addBookToBookshelf,
  getUserBookshelves,
  removeBookFromBookshelf,
  updateBookshelfFromBook,
  getUserBookshelvesFromBook,
} from "../controllers/bookShelfController"; // Adjust the import path as necessary

const router = express.Router();

router.post("/", createBookShelf);
router.post("/addBook", addBookToBookshelf);
router.get("/:id_usuario", getUserBookshelves);
router.delete("/remove_book", removeBookFromBookshelf);
router.patch("/update_bookshelf/:bookId", updateBookshelfFromBook);
router.get("/:userId/saw_bookshelves", getUserBookshelvesFromBook);

export default router;
