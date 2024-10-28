import { Router } from "express";
import {
    createReview,
    getReviewsByISBN,
    deleteReview,
    rateBook
} from "../controllers/reviewController";

const router = Router();

router.post("/review", createReview);
router.get("/rate", rateBook);

router.get("/:isbn", getReviewsByISBN);

router.delete("/:id", deleteReview);


export default router;
