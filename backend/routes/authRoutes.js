const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.post('/update-password', authMiddleware, updatePassword);

module.exports = router;
