const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    validate: {
      validator: v => /^[a-zA-Z ]+$/.test(v),
      message: 'Full name can only contain letters and spaces',
    },
  },
  streetAddress: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    validate: {
      validator: v => /^[a-zA-Z ]+$/.test(v),
      message: 'City can only contain letters and spaces',
    },
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    enum: {
      values: indianStates,
      message: 'State must be a valid Indian state',
    }
  },
  zip: {
    type: String,
    required: [true, 'Zip code is required'],
    validate: {
      validator: v => /^[1-9][0-9]{5}$/.test(v),
      message: 'Enter a valid 6-digit Indian PIN code',
    },
  },
  phone: {
    type: String,
    required: [true, 'Address phone number is required'],
    validate: {
      validator: v => /^[6-9]\d{9}$/.test(v),
      message: 'Enter a valid Indian mobile number',
    },
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: v => /^[a-zA-Z ]+$/.test(v),
      message: 'Name can only contain letters and spaces',
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[6-9]\d{9}$/.test(v),
      message: 'Enter a valid Indian mobile number',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Enter a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: v => validator.isStrongPassword(v, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      }),
      message: 'Password must be strong (min 6 chars with at least 1 number)',
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String,
    minlength: 6,
    maxlength: 6,
    validate: {
      validator: v => !v || /^\d{6}$/.test(v),
      message: 'OTP must be a 6-digit number',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
    min: 15,
    max: 120,
    validate: {
      validator: Number.isInteger,
      message: 'Age must be an integer',
    },
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    lowercase: true,
    trim: true,
  },
  jewelleryInterests: {
    type: [String],
    default: ['Rings', 'Necklaces'],
    enum: {
      values: ['Rings', 'Necklaces', 'Bracelets', 'Watches', 'Brooches', 'Anklets', 'Cufflinks', 'Earrings'],
      message: 'Category must be one of allowed values',
    }
  },
  address: [addressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.otp;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.otp;
      return ret;
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
