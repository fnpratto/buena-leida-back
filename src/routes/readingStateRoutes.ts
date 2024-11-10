import express from 'express';
import {
    saveBookReadingState,
    getReadingStateForBook,
    getBooksByReadingState,
} from '../controllers/readingStateControler';

const router = express.Router();

router.post("/", saveBookReadingState);

router.get("/:userId/:bookId", getReadingStateForBook);

router.get("/:userId/state/:status", getBooksByReadingState);


export default router;
