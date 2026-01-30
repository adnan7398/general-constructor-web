import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    role: {
        type: String, // e.g., CEO, Homeowner
        default: 'Client'
    },
    quote: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    image: {
        type: String // URL to client image
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
