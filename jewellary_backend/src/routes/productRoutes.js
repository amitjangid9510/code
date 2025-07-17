const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/multer');

router.post(
  '/',
  upload.fields([
    { name: 'defaultImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  productController.createProduct
);
router.get('/', productController.getAllProducts);
router.get('/product/:id', productController.getSingleProduct);
router.delete('/product/:id', productController.deleteProduct);
router.post(
  '/update/:id',
  upload.fields([
    { name: 'defaultImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  productController.updateProduct
);
// router.get('/featured', productController.getFeaturedProducts);
// router.get('/related/:productId', productController.getRelatedProducts);
// router.get('/:slug', productController.getProductBySlug);

module.exports = router;
