const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    console.log('Auth middleware triggered'); // Debug log
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Invalid auth header:', authHeader);
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = { id: decoded.id }; // Explicitly set id
        next();
    } catch (error) {
        console.log('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;