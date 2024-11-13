import { Router } from "express";
import {
  createReview,
  getReviewsByISBN,
  deleteReview,
  rateBook,
  getMyReviewByISBN,
  deleteMyReview,
  toggleLike,
  getReviewsByUserId,
  addBookReviews,
} from "../controllers/reviewController";

const router = Router();

router.post("/review", createReview);
router.post("/rate", rateBook);
router.get("/:isbn", getReviewsByISBN);
router.get("/:isbn/myreview", getMyReviewByISBN);
router.delete("/:isbn/:iduser", deleteMyReview);
router.post("/:id/:iduser/like", toggleLike);
router.get("/user/:iduser", getReviewsByUserId);
router.post("/lots",addBookReviews)

router.delete("/:id", deleteReview);

export default router;
