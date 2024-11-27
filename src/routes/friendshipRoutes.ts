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
router.post("/friends/:userid/:friendid", createFriendship);
router.delete("/friends/:userid/:friendid", deleteFriendship);


export default router;
