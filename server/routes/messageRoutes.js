import express from 'express';
import { upload } from "../configs/multer.js";
import { protect } from "../middleware/auth.js";
import { getChatMessages, sendMessage, ssController } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/:userId', protect, ssController); // protect if needed
messageRouter.post('/send', protect, upload.single('image'), sendMessage);
messageRouter.post('/get', protect, getChatMessages);

export default messageRouter;
