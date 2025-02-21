const express = require("express");
const router = express.Router();
const {sendOTP, verifyOTP} = require('../controllers/sendOtp');
const {resetPassword} = require('../controllers/userController');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.patch('/reset-password', resetPassword);

module.exports = router;    