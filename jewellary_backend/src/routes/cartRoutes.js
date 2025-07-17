const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.post('/update', authMiddleware, cartController.updateCartItem);
router.delete('/:productId', authMiddleware, cartController.removeCartItem);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
