const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        await newUser.save();  // Save the user to the database
        res.json({ msg: 'User created successfully, please login to access your account.' });
    } catch (err) {
        res.status(500).json({ msg: 'Error creating user', error: err });
    }
};