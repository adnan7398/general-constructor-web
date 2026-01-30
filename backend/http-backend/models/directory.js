import mongoose from 'mongoose';

const directorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Directory',
        default: null,
        index: true,
    },
    // Path string for easier querying/display (e.g., "/Root/Docs/Architecture")
    path: {
        type: String,
        default: '/',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // or Admin/TeamMember depending on auth
    },
}, {
    timestamps: true,
});

// Ensure name is unique within the same parent folder
directorySchema.index({ project: 1, parent: 1, name: 1 }, { unique: true });

const Directory = mongoose.models.Directory || mongoose.model('Directory', directorySchema);
export default Directory;
