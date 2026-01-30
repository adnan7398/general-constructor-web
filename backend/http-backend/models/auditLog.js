import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true,
        enum: ['Report', 'Project', 'UserProfile', 'Budget']
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'SUBMIT']
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile',
        required: true
    },
    changes: [{
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed
    }],
    metadata: {
        ipAddress: String,
        userAgent: String,
        path: String
    },
    timestamp: { type: Date, default: Date.now }
});

// Index for quick lookup of history for a specific entity
AuditLogSchema.index({ entity: 1, entityId: 1, timestamp: -1 });

export default mongoose.model('AuditLog', AuditLogSchema);
