const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Product not available or out of stock' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
        total: product.sellingPrice * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // Recalculate total
      let total = 0;
      for (const item of cart.items) {
        const prod = await Product.findById(item.product);
        total += prod.sellingPrice * item.quantity;
      }
      cart.total = total;
      cart.updatedAt = new Date();
      await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        data: {
          items: [],
          total: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Product not in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1); // remove item
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.sellingPrice * item.quantity;
    }
    cart.total = total;
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const filteredItems = cart.items.filter(item => item.product.toString() !== productId);
    if (filteredItems.length === cart.items.length) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items = filteredItems;

    // Recalculate total
    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.sellingPrice * item.quantity;
    }
    cart.total = total;
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed', data: cart });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ success: true, message: 'Cart emptied' });
  } catch (err) {
    next(err);
  }
};
