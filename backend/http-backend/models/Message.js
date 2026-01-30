import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    projectType: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'Read', 'Replied', 'Archived'],
        default: 'New'
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
