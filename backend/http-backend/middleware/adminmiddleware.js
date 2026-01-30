import jwt from 'jsonwebtoken';
import User from '../models/admin.js';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // DEBUG

        if (!decoded) {
            console.log('Token decode failed'); // DEBUG
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const user = await User.findById(decoded.id);
        const count = await User.countDocuments();
        console.log('Middleware Debug:', {
            decodedId: decoded.id,
            userFound: !!user,
            modelName: User.modelName,
            collectionName: User.collection.name,
            totalUsersInDB: count
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found in DB (Check Logs)' });
        }

        // Normalize role to helper check
        if (user.role && user.role.toLowerCase() === 'admin') {
            user.role = 'SUPER_ADMIN'; // Temporary fix for legacy data if needed, though profile.tsx handles this in UI
        }

        req.user = user;
        req.userId = decoded.id;
        next();

    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const isAdmin = async (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
        next();
    } else {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
};

const AdminMiddleware = verifyToken;
export default AdminMiddleware;