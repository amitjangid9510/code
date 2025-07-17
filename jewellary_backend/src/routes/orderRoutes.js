const express = require('express');
const {getAllOrders,createOrder,getOrder,updateOrderStatus} = require('../controllers/orderController');
const authController = require('../controllers/userAuthController');

const router = express.Router();

//router.use(authController.protect);

router
  .route('/')
  .get(getAllOrders)
  .post(createOrder);

router
  .route('/:id')
  .get(getOrder);

router
  .route('/:id/status')
  .patch(updateOrderStatus);

module.exports = router;