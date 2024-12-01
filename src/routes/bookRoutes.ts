import { Router } from "express";
import {
  getBooks,
  createBooks,
  getBookById,
  getBookByAuthor,
  getBookByName,
  getRatingsCountByISBN,
  getBookByGenre,
  getTop6Books,
  getAllGenres,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/genres", getAllGenres); 
router.get("/:id", getBookById);
router.get("/title/:title", getBookByName);
router.get("/author/:author", getBookByAuthor);
router.get("/genre/:genre", getBookByGenre);
router.get("/top",getTop6Books)

router.post("/", createBooks);

router.get("/:isbn/ratings", getRatingsCountByISBN);

export default router;
