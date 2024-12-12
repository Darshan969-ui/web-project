const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.token; // Assumes you're using cookies to store the JWT

    if (!token) {
        req.isLoggedIn = false;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.isLoggedIn = true;
        req.user = decoded; // Attach user data to the request object
    } catch (err) {
        req.isLoggedIn = false;
    }
    next();
    console.log(req.isLoggedIn);
};

module.exports = checkAuth;
