// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const errorMiddleware = require('./middleware/errormiddleware');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const checkAuth = require('./middleware/authmiddleware');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to parse and cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkAuth);

// Handlebars setup with .hbs extension
app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        helpers: {
            gt: (v1, v2) => v1 > v2,
            lt: (v1, v2) => v1 < v2,
            eq: (v1, v2) => v1 === v2,
            inc: (value) => value + 1,
            dec: (value) => value - 1,
            range: (totalPages) => {
              return Array.from({ length: totalPages }, (_, index) => index + 1); // Create an array [1, 2, ..., totalPages]
            },
            
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    console.log('isLoggedIn status:', req.isLoggedIn);
    res.locals.isLoggedIn = req.isLoggedIn; // Pass isLoggedIn to all views
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', listingRoutes);


// Error handling middleware
app.use(errorMiddleware);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Database connection error:', err);
});
