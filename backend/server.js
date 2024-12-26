const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/errorHandler');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const authenticateJWT = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes'); // Add this line

dotenv.config(); // Ensure this is at the top

const app = express();

// Basic middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true
}));
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/study-plans', studyPlanRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;