const express = require('express');
const router = express.Router();
const { register, login, renderLogin, renderRegister } = require('../controller/authController');

router.get('/register', renderRegister);
router.get('/login', renderLogin);
router.post('/register', register);
router.post('/login', login);

// router.get('/', (req, res) => {
//     if (req.isLoggedIn) {
//         res.render('home', { isLoggedIn: req.isLoggedIn, userId: req.userId });
//     } else {
//         res.render('home', { isLoggedIn: req.isLoggedIn });
//     }
// });

module.exports = router;
