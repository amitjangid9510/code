const Order = require('../models/Order');

exports.getAllOrders = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role === 'user') {
      filter = { user: req.user.id };
    }

    const orders = await Order.find(filter);

    res.status(200).json({
      success: true,
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('No order found with that ID', 404));
    }

    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to view this order', 403)
      );
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    if (!req.user.emailVerified || !req.user.phoneVerified) {
      return next(
        new AppError('Please verify your email and phone to place an order', 403)
      );
    }

    if (!req.body.items || req.body.items.length === 0) {
      return next(new AppError('Your cart is empty', 400));
    }

    const itemsPrice = req.body.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const taxPrice = itemsPrice * 0.1; 
    const shippingPrice = 100; 
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const newOrder = await Order.create({
      user: req.user.id,
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    res.status(201).json({
      success: true, 
      data: {
        order: newOrder
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return next(new AppError('No order found with that ID', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (err) {
    next(err);
  }
};