import express from 'express';
import {
    saveBookReadingState,
    getReadingStateForBook,
    getBooksByReadingState,
} from '../controllers/readingStateControler';

const router = express.Router();

router.post("/", saveBookReadingState);

router.get("/:bookId", getReadingStateForBook);

router.get("/state/:status", getBooksByReadingState);

export default router;
