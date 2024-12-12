const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.renderRegister = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};
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
    console.log(req.body);
    try {
        await newUser.save();  // Save the user to the database
        res.render('auth/login', { msg: 'User created successfully, please login to access your account.' });
    } catch (err) {
        const errorMessage = 'Error creating user';
        res.render('error', { message: errorMessage });
    }
};
exports.renderLogin = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const errorMessage = 'User does not exist';
    res.render('error', { message: errorMessage });
           
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const errorMessage = 'Invalid credentials.';
    res.render('error', { message: errorMessage });
           
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        // res.render('listings.hbs', { 
        //     msg: 'Logged in successfully!', 
        //     msgType: 'success',
        //     isLoggedIn: req.isLoggedIn
        // });

        res.redirect('/api/list?page=1&perPage=5');

    } catch (err) {
        res.status(500).render('auth/login', { 
            msg: 'An error occurred. Please try again later.', 
            msgType: 'error' 
        });
    }
};
exports.logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token'); 
        res.status(200).redirect('/auth/login');
    } catch (error) {
        const errorMessage = error.message;
        res.status(500).render('error', { message: errorMessage });
    }
};
