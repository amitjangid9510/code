const express = require("express");
const authController  = require("../controllers/userAuthController");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/send-otp', authController.sendOtpForVerificationORLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-signup-otp', authController.verifyOtpForSignup);
router.post('/logout', authController.logout);
router.post('/change-password', authMiddleware, authController.changePassword);
router.get('/user', authMiddleware, authController.getCurrentUser);
router.delete('/delete-account', authMiddleware, authController.deleteAccount);


module.exports = router;
