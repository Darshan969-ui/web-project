const express = require('express');
const router = express.Router();
const { register, login, renderLogin, renderRegister } = require('../controller/authController');

router.get('/register', renderRegister);
router.get('/login', renderLogin);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
