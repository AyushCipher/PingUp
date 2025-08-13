import express from "express";
import {
    acceptConnectionRequest,
    discoverUsers,
    followUser,
    getUserConnections,
    getUserData,
    getUserProfiles,
    sendConnectionRequest,
    unfollowUser,
    updateUserData
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";
import { getUserRecentMessages } from "../controllers/messageController.js";

const userRouter = express.Router();

// Get current user data
userRouter.get('/data', protect, getUserData);

// Update user profile (memory storage for multer)
userRouter.post(
    '/update',
    protect,
    upload.fields([
        { name: 'profile', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    updateUserData
);

// Discover users
userRouter.post('/discover', protect, discoverUsers);

// Follow user
userRouter.post('/follow', protect, followUser);

// Unfollow user
userRouter.post('/unfollow', protect, unfollowUser);

userRouter.post('/connect', protect, sendConnectionRequest);

userRouter.post('/accept', protect, acceptConnectionRequest);

userRouter.get('/connections', protect, getUserConnections);

userRouter.post('/profiles', protect, getUserProfiles);

userRouter.get('/recent-messages', protect, getUserRecentMessages);

export default userRouter;
