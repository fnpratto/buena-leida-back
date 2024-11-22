import express from "express";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friendRequestController";

const router = express.Router();

router.post("/friend-requests", sendFriendRequest);
router.get("/friend-requests/:userId", getFriendRequests);
router.post("/friend-requests/:friendRequestId/accept", acceptFriendRequest);
router.delete("/friend-requests/:friendRequestId", rejectFriendRequest);

export default router;
