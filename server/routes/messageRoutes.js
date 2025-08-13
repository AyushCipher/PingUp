import express from 'express'
import { upload } from "../configs/multer.js";
import { protect } from "../middleware/auth.js";
import { addPost, getFeedPosts, likePost } from '../controllers/postController.js';
import { getChatMessages, sendMessage, ssController } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', ssController);
messageRouter.post('/send', upload.single('image'), protect, sendMessage);
messageRouter.post('/get', protect, getChatMessages);

export default messageRouter