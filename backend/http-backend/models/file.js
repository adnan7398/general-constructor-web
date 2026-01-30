import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Directory',
        default: null, // null means root directory
        index: true,
    },
    url: {
        type: String,
        required: true,
    },
    size: {
        type: Number, // in bytes
        required: true,
    },
    mimeType: {
        type: String,
        default: 'application/octet-stream',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// Ensure file name is unique within the same folder
fileSchema.index({ project: 1, folder: 1, name: 1 }, { unique: true });

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export default File;
