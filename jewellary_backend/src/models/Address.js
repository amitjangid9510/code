const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Address must belong to a user']
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the address']
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number']
  },
  pincode: {
    type: String,
    required: [true, 'Please provide a pincode']
  },
  locality: {
    type: String,
    required: [true, 'Please provide a locality']
  },
  address: {
    type: String,
    required: [true, 'Please provide an address']
  },
  city: {
    type: String,
    required: [true, 'Please provide a city']
  },
  state: {
    type: String,
    required: [true, 'Please provide a state']
  },
  landmark: String,
  alternatePhone: String,
  addressType: {
    type: String,
    required: [true, 'Please provide an address type'],
    enum: {
      values: ['home', 'work', 'other'],
      message: 'Address type is either: home, work, other'
    }
  },
  default: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;