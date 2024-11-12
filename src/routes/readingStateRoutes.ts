import express from 'express';
import {
    saveBookReadingState,
    getReadingStateForBook,
    getBooksByReadingState,
    removeBookReadingState,
} from '../controllers/readingStateControler';

const router = express.Router();

router.post("/", saveBookReadingState);

router.get("/:userId/:bookId", getReadingStateForBook);

router.get("/:userId/state/:status", getBooksByReadingState);

router.delete("/remove", removeBookReadingState);


export default router;
