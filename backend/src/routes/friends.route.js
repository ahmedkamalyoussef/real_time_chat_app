import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  searchFriend,
  getFriendRequests,
  getOnlineFriends,
} from "../controllers/friendship.controller.js";
const router = express.Router();

router.get("/", protect, getFriends);
router.get("/search", protect, searchFriend);
router.get("/requests", protect, getFriendRequests);
router.get("/online/:userId", protect, getOnlineFriends);
router.patch("/accept/:requesterId", protect, acceptFriendRequest);
router.post("/send/:recipientId", protect, sendFriendRequest);
router.post("/reject/:requesterId", protect, rejectFriendRequest);
export default router;
