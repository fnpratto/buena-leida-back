import { Router } from "express";
import {
    createComment,
    getCommentsOfIdReview,
    deleteComment
} from "../controllers/commentController";

const router = Router();

router.post("/", createComment);

router.get("/:idReview", getCommentsOfIdReview);

router.delete("/:idComment/:idUser", deleteComment);

export default router;