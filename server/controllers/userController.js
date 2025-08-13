// import Connection from "../models/Connection.js";
// import imagekit from "../configs/imageKit.js";
// import User from "../models/User.js";

// // Get User data using userId
// export const getUserData = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.json({ success: false, message: "User Not Found" });
//         }

//         res.json({ success: true, user });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Update user data using userId
// export const updateUserData = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         let { username, bio, location, full_name } = req.body;

//         const tempUser = await User.findById(userId);
//         if (!tempUser) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         // If username not provided, keep existing
//         if (!username) username = tempUser.username;

//         // Check if new username is already taken
//         if (tempUser.username !== username) {
//             const existingUser = await User.findOne({ username });
//             if (existingUser) {
//                 username = tempUser.username;
//             }
//         }

//         const updatedData = {
//             username,
//             bio,
//             location,
//             full_name,
//         };

//         const profile = req.files?.profile?.[0];
//         const cover = req.files?.cover?.[0];

//         if (profile) {
//             const response = await imagekit.upload({
//                 file: profile.buffer, 
//                 fileName: profile.originalname,
//             });

//             updatedData.profile_picture = imagekit.url({
//                 path: response.filePath,
//                 transformation: [
//                     { quality: 'auto' },
//                     { format: 'webp' },
//                     { width: '512' },
//                 ],
//             });
//         }

//         if (cover) {
//             const response = await imagekit.upload({
//                 file: cover.buffer,
//                 fileName: cover.originalname,
//             });

//             updatedData.cover_photo = imagekit.url({
//                 path: response.filePath,
//                 transformation: [
//                     { quality: 'auto' },
//                     { format: 'webp' },
//                     { width: '1280' },
//                 ],
//             });
//         }

//         const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
//         res.json({ success: true, user, message: 'Profile Updated Successfully' });

//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Find Users using username, email, location and name
// export const discoverUsers = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { input } = req.body;

//         if (!input || typeof input !== "string") {
//             return res.json({ success: false, message: "Invalid search input" });
//         }

//         const allUsers = await User.find({
//             $or: [
//                 { username: new RegExp(input, 'i') },
//                 { email: new RegExp(input, 'i') },
//                 { full_name: new RegExp(input, 'i') },
//                 { location: new RegExp(input, 'i') },
//             ]
//         });

//         const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);
//         res.json({ success: true, users: filteredUsers });

//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Follow Users
// export const followUser = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { id } = req.body;

//         const user = await User.findById(userId);
//         if (!user) return res.json({ success: false, message: "User not found" });

//         if (user.following.includes(id)) {
//             return res.json({ success: false, message: 'You are already following this user' });
//         }

//         user.following.push(id);
//         await user.save();

//         const toUser = await User.findById(id);
//         if (toUser) {
//             toUser.followers.push(userId);
//             await toUser.save();
//         }

//         res.json({ success: true, message: 'Now you are following this user' });

//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Unfollow users
// export const unfollowUser = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { id } = req.body;

//         const user = await User.findById(userId);
//         if (!user) return res.json({ success: false, message: "User not found" });

//         user.following = user.following.filter(f => f.toString() !== id);
//         await user.save();

//         const toUser = await User.findById(id);
//         if (toUser) {
//             toUser.followers = toUser.followers.filter(f => f.toString() !== userId);
//             await toUser.save();
//         }

//         res.json({ success: true, message: 'You are no longer following this user.' });

//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };


// // Send Connection Request
// export const sendConnectionRequest = async(req, res) => {
//     try{
//         const { userId } = req.auth();
//         const { id } = req.body;

//         // Check if user has more than 20 connection requests in last 24 hours
//         const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
//         const connectionRequests = await Connection.find({from_user_id: userId, 
//             created_at: {$gt: last24Hours}})
//             if(connectionRequests.length >= 20) {
//                 return res.json({success: false, message: 'You have sent more than 20 connection requests in last 24 hours'})
//             }
        
//         // Check if user has already connected with the person
//         const connection = await Connection.findOne({
//             $or:[
//                 {from_user_id: userId, to_user_id: id},
//                 {from_user_id: id, to_user_id: userId},
//             ]
//         })

//         if(!connection) {
//             await Connection.create({
//                 from_user_id: userId,
//                 to_user_id: id,
//             })
//             return res.json({success: true, message: 'Connection request sent successfully'})
//         }
//         else if(connection && connection.status === 'accepted') {
//             return res.json({success: false, message: 'You are already connected with this user'})
//         }
//         else{
//             return res.json({success: false, message: 'Connection request pending'})
//         }

//     } catch(error) {
//         console.error(error);
//         res.json({ success: false, message: error.message }); 
//     }
// }

// // Get user connections
// export const getUserConnections = async(req, res) => {
//     try{
//         const { userId } = req.auth();
//         const user = await User.findById(userId).populate('connections followers following')

//         const connections = user.connections;
//         const followers = user.followers;
//         const following = user.following;

//         const pendingConnections = (await Connection.find({to_user_id: userId, 
//         status: 'pending'}).populate('from_user_id').map(connection => connection.from_user_id))

//         req.json({success: true, connections, followers, following, pendingConnections})

//     } catch(error) {
//         console.error(error);
//         res.json({ success: false, message: error.message }); 
//     }
// }

// // Accept the connection request
// export const acceptConnectionRequest = async(req, res) => {
//     try{
//         const { userId } = req.auth();
//         const { id } = req.body;

//         const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

//         if(!connection) {
//             return res.json({success: false, message: 'Connection not found'})
//         }

//         const user = await User.findById(userId);
//         user.connections.push(id);
//         await user.save();

//         const toUser = await User.findById(id);
//         toUser.connections.push(userId);
//         await toUser.save();

//         connection.status = 'accepted';
//         await connection.save();

//         return res.json({success: true, message: 'Connection added successfully'})

//     } catch(error) {
//         console.error(error);
//         res.json({ success: false, message: error.message }); 
//     }
// }

import Connection from "../models/Connection.js";
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { inngest } from "../inngest/index.js";

// Get User data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user data using userId
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        let { username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId);
        if (!tempUser) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!username) username = tempUser.username;

        if (tempUser.username !== username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                username = tempUser.username;
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name,
        };

        const profile = req.files?.profile?.[0];
        const cover = req.files?.cover?.[0];

        if (profile) {
            const response = await imagekit.upload({
                file: profile.buffer,
                fileName: profile.originalname,
            });

            updatedData.profile_picture = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "512" },
                ],
            });
        }

        if (cover) {
            const response = await imagekit.upload({
                file: cover.buffer,
                fileName: cover.originalname,
            });

            updatedData.cover_photo = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: "auto" },
                    { format: "webp" },
                    { width: "1280" },
                ],
            });
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        res.json({ success: true, user, message: "Profile Updated Successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Find Users using username, email, location and name
export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { input } = req.body;

        if (!input || typeof input !== "string") {
            return res.json({ success: false, message: "Invalid search input" });
        }

        const allUsers = await User.find({
            $or: [
                { username: new RegExp(input, "i") },
                { email: new RegExp(input, "i") },
                { full_name: new RegExp(input, "i") },
                { location: new RegExp(input, "i") },
            ],
        });

        const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);
        res.json({ success: true, users: filteredUsers });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Follow Users
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.following.includes(id)) {
            return res.json({ success: false, message: "You are already following this user" });
        }

        user.following.push(id);
        await user.save();

        const toUser = await User.findById(id);
        if (toUser) {
            toUser.followers.push(userId);
            await toUser.save();
        }

        res.json({ success: true, message: "Now you are following this user" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Unfollow users
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        user.following = user.following.filter(f => f.toString() !== id);
        await user.save();

        const toUser = await User.findById(id);
        if (toUser) {
            toUser.followers = toUser.followers.filter(f => f.toString() !== userId);
            await toUser.save();
        }

        res.json({ success: true, message: "You are no longer following this user." });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.body;

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const connectionRequests = await Connection.find({
            from_user_id: userId,
            created_at: { $gt: last24Hours },
        });

        if (connectionRequests.length >= 20) {
            return res.json({ success: false, message: "You have sent more than 20 connection requests in last 24 hours" });
        }

        const connection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId },
            ],
        });

        if (!connection) {
            const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id,
            });

            // Trigger the event to instantly send an email for a connection request
            await inngest.send({
                name: 'app/connection-request',
                data: {connectionId: newConnection._id}
            })

            return res.json({ success: true, message: "Connection request sent successfully" });
        } else if (connection && connection.status === "accepted") {
            return res.json({ success: false, message: "You are already connected with this user" });
        } else {
            return res.json({ success: false, message: "Connection request pending" });
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user connections
export const getUserConnections = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findById(userId).populate("connections followers following");

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = (await Connection.find({
            to_user_id: userId,
            status: "pending",
        }).populate("from_user_id")).map(connection => connection.from_user_id);

        res.json({ success: true, connections, followers, following, pendingConnections });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Accept the connection request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { id } = req.body;

        const connection = await Connection.findOne({
            from_user_id: id,
            to_user_id: userId,
        });

        if (!connection) {
            return res.json({ success: false, message: "Connection not found" });
        }

        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save();

        const toUser = await User.findById(id);
        toUser.connections.push(userId);
        await toUser.save();

        connection.status = "accepted";
        await connection.save();

        return res.json({ success: true, message: "Connection added successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get User Profiles
export const getUserProfiles = async (req, res) => {
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId);

        if(!profile) {
            return res.json({ success: false, message: "Profile Not Found" });
        }

        const posts = await Post.find({user: profileId}).populate('user');
        res.json({success: true, profile, posts})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
