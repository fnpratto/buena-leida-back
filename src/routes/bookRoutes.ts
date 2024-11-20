import { Router } from "express";
import {
  getBooks,
  createBooks,
  getBookById,
  getBookByTitleAndAuthor,
  getBookByAuthor,
  getBookByName,
  getRatingsCountByISBN,
  getBookByGenre,
  getAllGenres,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get("/title/:title", getBookByName);
router.get("/author/:author", getBookByAuthor);
router.get("/genre/:genre", getBookByGenre);
router.get("/genres", getAllGenres); 

//router.get("/:title/:author", getBookByTitleAndAuthor);
router.post("/", createBooks);

router.get("/:isbn/ratings", getRatingsCountByISBN);

export default router;
