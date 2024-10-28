import { Router } from "express";
import {
    createReview,
    getReviewsByISBN,
    deleteReview,
    rateBook,
    getMyReviewByISBN,
    toggleLike
} from "../controllers/reviewController";

const router = Router();

router.post("/review", createReview);
router.post("/rate", rateBook);

router.get("/:isbn", getReviewsByISBN);

router.get("/:isbn/myreview", getMyReviewByISBN);
router.delete("/:id", deleteReview);

router.post('/:id/like', toggleLike);

export default router;
