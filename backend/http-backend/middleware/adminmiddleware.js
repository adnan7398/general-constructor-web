const jwt = require('jsonwebtoken');
function AdminMiddleware(req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeadr || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Unauthorized'});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'Unauthorized'});
        }
        console.log
        req.userId = decoded.id;
        next();

    }catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({message: 'Unauthorized'});
    }
}