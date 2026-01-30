import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
    tagline: {
        type: String,
        required: true,
        default: "We don't just build walls — we build vibes."
    },
    subtext: {
        type: String,
        required: true,
        default: "Experience the perfect blend of innovative design and unmatched quality."
    },
    backgroundImage: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Ensure only one active hero config might be best, but for now just simple schema
export default mongoose.model('HeroContent', heroSchema);
