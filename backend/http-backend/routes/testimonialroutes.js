import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { verifyToken, isAdmin } from '../middleware/adminmiddleware.js';

const router = express.Router();

// GET all testimonials (public facing might filter by approved)
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new testimonial (Admin creates)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const testimonial = new Testimonial(req.body);
    try {
        const newTestimonial = await testimonial.save();
        res.status(201).json(newTestimonial);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update testimonial
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE testimonial
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
