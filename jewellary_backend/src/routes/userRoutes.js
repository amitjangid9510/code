const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/user',authMiddleware, userController.updateUser);
router.post('/wishlist', authMiddleware, userController.addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, userController.removeFromWishlist);
router.get('/wishlist', authMiddleware, userController.getWishlist);

module.exports = router;