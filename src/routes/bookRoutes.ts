import { Router } from "express";
import {
  getBooks,
  createBooks,
  getBookById,
  getBookByTitleAndAuthor,
  getBookByAuthor,
  getBookByName,
  getRatingsCountByISBN,
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get("/title/:title/?sort=rankings", getBookByName);
router.get("/author/:author/?sort=rankings", getBookByAuthor);
router.get("/:title/:author", getBookByTitleAndAuthor);
router.post("/", createBooks);


router.get("/:isbn/ratings", getRatingsCountByISBN);

export default router;
