import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    from_user_id: {type: String, ref: 'User', required: true},
    to_user_id: {type: String, ref: 'User', required: true},
    text: {type: String, trim: true},
    message_type: {type: String, enum: ['text', 'image']},
    media_url: {type: String},
    seen: {type: Boolean, default: false}

}, {timestamps: true})

const Message = mongoose.model('Message', messageSchema);

export default Message


// const messageSchema = new mongoose.Schema({
//     from_user_id: { type: String, ref: 'User', required: true },
//     to_user_id: { type: String, ref: 'User', required: true },
//     text: { type: String, trim: true },
//     message_type: { 
//         type: String, 
//         enum: ['text', 'image', 'voice', 'video', 'call_invite', 'call_end'], 
//         required: true 
//     },
//     media_url: { type: String }, // could store image, audio, or video file
//     call_duration: { type: Number }, // seconds, for completed calls
//     call_status: { type: String, enum: ['missed', 'rejected', 'answered'] },
//     seen: { type: Boolean, default: false }
// }, { timestamps: true });
