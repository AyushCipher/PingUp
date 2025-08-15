import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Message from '../models/Message.js';

// Store SSE connections
const connections = {};

// SSE Controller
export const ssController = (req, res) => {
    const { userId } = req.params;
    console.log("New client connected:", userId);

    // Set SSE headers
    res.setHeader('Content-type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Save connection
    connections[userId] = res;

    // Initial message
    res.write(`data: ${JSON.stringify({ message: 'Connected to SSE stream' })}\n\n`);

    // Remove connection on close
    req.on('close', () => {
        delete connections[userId];
        console.log('Client disconnected:', userId);
    });
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth; // or req.auth()
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        // If file present, upload
        if (image) {
            const fileBuffer = fs.readFileSync(image.path);
            const uploadResponse = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
                folder: 'messages'
            });

            media_url = imagekit.url({
                path: uploadResponse.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            });
        }

        // Save message in DB
        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text: message_type === 'text' ? text : '',
            message_type,
            media_url,
        });

        res.json({ success: true, message });

        // Send message via SSE
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');
        if (connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ]
        }).sort({ createdAt: -1 });

        // Mark as seen
        await Message.updateMany(
            { from_user_id: to_user_id, to_user_id: userId },
            { seen: true }
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get recent messages sent to user
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth;
        const messages = await Message.find({ to_user_id: userId })
            .populate('from_user_id to_user_id')
            .sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



// import fs from 'fs';
// import imagekit from '../configs/imageKit.js';
// import Message from '../models/Message.js';

// const connections = {};

// // SSE Controller
// export const ssController = (req, res) => {
//     const { userId } = req.params;
//     console.log("New client connected:", userId);

//     res.setHeader('Content-type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     connections[userId] = res;
//     res.write('log: Connected to SSE stream\n\n');

//     req.on('close', () => {
//         delete connections[userId];
//         console.log('Client disconnected:', userId);
//     });
// };

// // Send message (text, image, voice)
// export const sendMessage = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { to_user_id, text } = req.body;
//         const file = req.file; // Can be image or audio

//         let media_url = '';
//         let message_type = 'text';

//         // Detect type if file is present
//         if (file) {
//             const mimeType = file.mimetype;

//             if (mimeType.startsWith('image/')) {
//                 message_type = 'image';
//             } else if (mimeType.startsWith('audio/')) {
//                 message_type = 'voice';
//             }

//             // Upload to ImageKit
//             const fileBuffer = fs.readFileSync(file.path);
//             const uploadResponse = await imagekit.upload({
//                 file: fileBuffer,
//                 fileName: file.originalname,
//                 folder: "messages"
//             });

//             // Transform images only
//             media_url = imagekit.url({
//                 path: uploadResponse.filePath,
//                 transformation: message_type === 'image'
//                     ? [{ quality: 'auto' }, { format: 'webp' }, { width: '1280' }]
//                     : []
//             });
//         }

//         // Create message
//         const message = await Message.create({
//             from_user_id: userId,
//             to_user_id,
//             text: message_type === 'text' ? text : '',
//             message_type,
//             media_url
//         });

//         res.json({ success: true, message });

//         // Send via SSE
//         const messageWithUserData = await Message.findById(message._id)
//             .populate('from_user_id');

//         if (connections[to_user_id]) {
//             connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
//         }

//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Get chat messages between two users
// export const getChatMessages = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { to_user_id } = req.body;

//         const messages = await Message.find({
//             $or: [
//                 { from_user_id: userId, to_user_id },
//                 { from_user_id: to_user_id, to_user_id: userId }
//             ]
//         }).sort({ createdAt: -1 });

//         // Mark as seen
//         await Message.updateMany(
//             { from_user_id: to_user_id, to_user_id: userId },
//             { seen: true }
//         );

//         res.json({ success: true, messages });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Get all recent messages sent to a user
// export const getUserRecentMessages = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const messages = await Message.find({ to_user_id: userId })
//             .populate('from_user_id to_user_id')
//             .sort({ createdAt: -1 });

//         res.json({ success: true, messages });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };



