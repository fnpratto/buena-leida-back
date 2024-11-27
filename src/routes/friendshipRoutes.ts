import express from "express";
import {
  areFriends,
  getAllFriends,
  createFriendship,
  deleteFriendship,
} from "../controllers/friendshipController";

const router = express.Router();

router.get("/friends/:userid/:friendid", areFriends);
router.get("/friends/:userid", getAllFriends);
router.post("/friends", createFriendship);
router.delete("/friends", deleteFriendship);


export default router;
