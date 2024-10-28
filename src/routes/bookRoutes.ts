import { Router } from "express";
import {
    getBooks,
    createBook,
    getBookById,
    getBookByTitleAndAuthor,
    getBookByAuthor,
    getBookByName,
    getRatingsCountByISBN
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get('/:title/:author', getBookByTitleAndAuthor);
router.get('/:title', getBookByName);
router.get('/:author', getBookByAuthor);
router.post("/", createBook);

router.get('/:isbn/ratings', getRatingsCountByISBN);


export default router;
