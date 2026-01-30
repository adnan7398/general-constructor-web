import express from 'express';
import Message from '../models/Message.js';
import { verifyToken, isAdmin } from '../middleware/adminmiddleware.js';

const router = express.Router();

// POST new message (Public)
router.post('/', async (req, res) => {
    const message = new Message(req.body);
    try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all messages (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update status (Admin only) - e.g., mark as read
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE message (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
