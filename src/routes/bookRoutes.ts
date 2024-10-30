import { Router } from "express";
import {
  getBooks,
  createBook,
  getBookById,
  getBookByTitleAndAuthor,
  getBookByAuthor,
  getBookByName,
  getRatingsCountByISBN,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get("/title/:title", getBookByName);
router.get("/author/:author", getBookByAuthor);
router.get("/:title/:author", getBookByTitleAndAuthor);
router.post("/", createBook);

router.get("/:isbn/ratings", getRatingsCountByISBN);

export default router;
