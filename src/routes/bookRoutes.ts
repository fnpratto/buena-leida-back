import { Router } from "express";
import { getBooks, 
        createBook, 
        getBookById 
    } from "../controllers/bookController";

const router = Router();

router.get("/", getBooks);
router.get("/books/:id", getBookById);
router.post("/", createBook);

export default router;
