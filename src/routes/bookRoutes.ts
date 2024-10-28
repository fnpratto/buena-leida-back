import { Router } from "express";
import {
    getBooks,
    createBook,
    getBookById,
    getBookByTitleAndAuthor,
    getBookByAuthor,
    getBookByName
} from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.get('/:title/:author', getBookByTitleAndAuthor);
router.get('/:title', getBookByName);
router.get('/:author', getBookByAuthor);
router.post("/", createBook);

export default router;
