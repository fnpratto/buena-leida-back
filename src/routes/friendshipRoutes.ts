import express from "express";
import {
  areFriends,
  getAllFriends,
  createFriendship,
  deleteFriendship,
} from "../controllers/friendshipController";

const router = express.Router();

router.get("/friends/:userId/:friendId", areFriends);
router.get("/friends/:userId", getAllFriends);
router.post("/friends", createFriendship);
router.delete("/friends", deleteFriendship);

export default router;
