import { Router } from "express";
import { 
    createReview, 
    getReviewsByISBN, 
    deleteReview 
} from "../controllers/reviewController";

const router = Router();

router.post("/", createReview);

router.get("/:isbn", getReviewsByISBN);

router.delete("/:id", deleteReview);


export default router;
