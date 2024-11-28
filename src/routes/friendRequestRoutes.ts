import express from "express";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friendRequestController";

const router = express.Router();

router.post("/request", sendFriendRequest);
router.get("/:receiverid", getFriendRequests);
router.post("/:friendRequestId/accept", acceptFriendRequest);
router.delete("/:friendRequestId/delete", rejectFriendRequest);

export default router;
