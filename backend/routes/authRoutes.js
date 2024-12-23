const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route for user registration
router.post('/register', registerUser);

// // Test Route
// router.post('/register', (req, res) => {
//     res.json({ message: 'Test endpoint hit' });
// });
// Route for user login
router.post('/login', loginUser); // New login route

module.exports = router;
