// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Registration Handler
const registerUser = async (req, res) => {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create New User - let the mongoose middleware handle password hashing
        const newUser = await User.create({
            name,
            email,
            password // Remove manual hashing here
        });

        console.log('User Created:', newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error in registration', error });
    }
};

// User Login Handler
const loginUser = async (req, res) => {
    console.log('Login endpoint hit');
    console.log('Request body:', req.body);
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        console.log('User Found:', user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            userId: user._id // Added userId to response for frontend use
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Error during login', error });
    }
};

module.exports = { registerUser, loginUser };