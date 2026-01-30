import express from 'express';
import HeroContent from '../models/HeroContent.js';
import { verifyToken, isAdmin } from '../middleware/adminmiddleware.js';

const router = express.Router();

// GET hero content (usually just the active one)
router.get('/', async (req, res) => {
    try {
        const hero = await HeroContent.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.json(hero || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST/PUT hero content (Admin only)
// Simplification: Always create new or update existing to keep one active
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        // Optional: Deactivate others if we want history
        // await HeroContent.updateMany({}, { isActive: false });

        // Check if one exists to update or create new
        let hero = await HeroContent.findOne({ isActive: true });

        if (hero) {
            Object.assign(hero, req.body);
            const updatedHero = await hero.save();
            return res.json(updatedHero);
        } else {
            const newHero = new HeroContent(req.body);
            const savedHero = await newHero.save();
            return res.status(201).json(savedHero);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
