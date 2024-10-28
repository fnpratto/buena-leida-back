import { Router } from "express";
import {
    createReview,
    getReviewsByISBN,
    deleteReview,
    rateBook,
    getMyReviewByISBN,
    deleteMyReview,
    toggleLike
} from "../controllers/reviewController";

const router = Router();

router.post("/review", createReview);
router.post("/rate", rateBook);

router.get("/:isbn", getReviewsByISBN);

router.get("/:isbn/myreview", getMyReviewByISBN);
router.delete("/:isbn/:iduser", deleteMyReview);
router.delete("/:id", deleteReview);

router.post('/:id/:iduser/like', toggleLike);

export default router;
