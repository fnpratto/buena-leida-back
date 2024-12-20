import express from "express";
import {
  areFriends,
  getAllFriends,
  createFriendship,
  deleteFriendship,
  getFriendshipState,
} from "../controllers/friendshipController";

const router = express.Router();

router.get("/friends/:userid/:friendid", areFriends);
router.get("/:userid/:friendid/state", getFriendshipState);
router.get("/all/:userid", getAllFriends);
router.post("/friends", createFriendship);
router.delete("/:userid/:friendid/delete", deleteFriendship);


export default router;
