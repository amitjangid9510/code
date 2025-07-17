const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true,
    maxlength: [100, 'Product name must be at most 100 characters'],
    minlength: [5, 'Product name must be at least 5 characters']
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true
  },
  mrp: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price must be above 0']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'A product must have a price'],
    min: [0, 'Price must be above 0']
  },
  discount: {
    type: Number,
    required:true
  },
  category: {
    type: String,
    required: [true, 'A product must belong to a category'],
    enum: {
      values: [
        'rings',
        'necklaces',
        'earrings',
        'bracelets',
        'bangles',
        'mangalsutra',
        'anklets',
        'nosepins',
        'pendants',
        'chains',
        'watches',
        'other'
      ],
      message: 'Invalid category'
    }
  },
  subCategory: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    enum: ['gold', 'silver', 'platinum', 'diamond', 'pearl', 'gemstone','ruby','titanium', 'other']
  },
  purity: {
    type: String,
    required: function () {
      return ['gold', 'silver', 'platinum'].includes(this.material);
    },
    enum: ['14k', '18k', '22k', '24k', '925', '950', '990', '999','']
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.1, 'Weight must be greater than 0']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock must be 0 or more']
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0'],
    max: [5, 'Rating must be 5 or below'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  images: {
    type: [String],
    validate: {
      validator: function (files) {
        return files.every(file =>
          /^\/?uploads\/.+\.(jpg|jpeg|png|webp|svg)$/i.test(file)
        );
      },
      message: 'Each additional image must be a valid image file stored under /uploads/'
    }
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    default: 'Women'
  },
  occasion: {
    type: String,
    required: [true, 'Occasion is required'],
    enum: {
      values: ['Wedding', 'Engagement', 'Festive', 'Party', 'Daily Wear', 'Gift', 'Office'],
      message: 'Invalid occasion value: {VALUE}'
    }
  },
  warrantyInMonths: {
    type: Number,
    min: [0, 'Warranty cannot be negative']
  },
  isReturnable: {
    type: Boolean,
    required: true,
    default: false
  },
  returnPolicyDays: {
    type: Number,
    default: null,
    min: [0, 'Return days cannot be negative'],
    required: function () {
      return this.isReturnable;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', productSchema);
