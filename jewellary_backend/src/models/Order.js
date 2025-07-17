const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },

    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1']
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    shippingInfo: {
      fullName: {
        type: String,
        required: [true, 'Shipping name is required']
      },
      address: {
        type: String,
        required: [true, 'Shipping address is required']
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Invalid phone number']
      }
    },

    paymentInfo: {
      method: {
        type: String,
        enum: ['COD', 'Razorpay', 'Stripe'],
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
      },
      paymentId: String
    },

    orderSummary: {
      itemsPrice: {
        type: Number,
        required: true
      },
      shippingCharge: {
        type: Number,
        default: 0
      },
      discount: {
        type: Number,
        default: 0
      },
      totalAmount: {
        type: Number,
        required: true
      }
    },

    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing'
    },

    isDelivered: {
      type: Boolean,
      default: false
    },

    deliveredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Order', orderSchema);
