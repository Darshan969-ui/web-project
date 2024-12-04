const express = require('express');
const router = express.Router();
const { register } = require('../controller/authController');
const { login } = require('../controller/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
