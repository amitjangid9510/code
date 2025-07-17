const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      mrp,
      sellingPrice,
      discount,
      category,
      subCategory,
      material,
      purity,
      weight,
      stock,
      featured,
      gender,
      occasion,
      warrantyInMonths,
      isReturnable,
      returnPolicyDays
    } = req.body;

    if (Number(sellingPrice) > Number(mrp)) {
      return res.status(400).json({
        status: false,
        message: 'Selling price cannot be greater than MRP'
      });
    }

    if (!occasion || typeof occasion !== 'string') {
      return res.status(400).json({
        status: false,
        message: 'Occasion must be a valid string',
      });
    }

    if (isReturnable === 'true' || isReturnable === true) {
      if (!returnPolicyDays && returnPolicyDays !== 0) {
        return res.status(400).json({
          status: false,
          message: 'Return policy days are required when product is returnable'
        });
      }
    }

    const defaultImageFile = req.files?.defaultImage?.[0];
    const additionalImageFiles = req.files?.images || [];

    if (!defaultImageFile) {
      return res.status(400).json({
        status: false,
        message: 'Default image is required'
      });
    }

    const defaultImagePath = `/uploads/${defaultImageFile.filename}`;
    const additionalImagePaths = additionalImageFiles.map(file => `/uploads/${file.filename}`);

    const allImages = [defaultImagePath, ...additionalImagePaths];

    const newProduct = await Product.create({
      name,
      description,
      mrp,
      sellingPrice,
      discount,
      category,
      subCategory,
      material,
      purity,
      weight,
      stock,
      featured,
      gender,
      occasion,
      warrantyInMonths,
      isReturnable,
      returnPolicyDays,
      images: allImages
    });

    res.status(201).json({
      status: true,
      data: {
        product: newProduct
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const filters = {};

    if (req.query.category) filters.category = req.query.category;
    if (req.query.subCategory) filters.subCategory = req.query.subCategory;
    if (req.query.material) filters.material = req.query.material;
    if (req.query.purity) filters.purity = req.query.purity;
    if (req.query.featured) filters.featured = req.query.featured === 'true';
    if (req.query.gender) filters.gender = req.query.gender;
    if (req.query.isReturnable) filters.isReturnable = req.query.isReturnable === 'true';
    if (req.query.occasion) filters.occasion = { $in: req.query.occasion.split(',') };

    if (search.trim()) {
      const searchRegex = new RegExp(search, 'i');
      filters.$or = [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { subCategory: { $regex: searchRegex } },
        { occasion: { $regex: searchRegex } }
      ];
    }

    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        status: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      mrp,
      sellingPrice,
      discount,
      category,
      subCategory,
      material,
      purity,
      weight,
      stock,
      featured,
      gender,
      occasion,
      warrantyInMonths,
      isReturnable,
      returnPolicyDays
    } = req.body;

    if (sellingPrice && mrp && Number(sellingPrice) > Number(mrp)) {
      return res.status(400).json({
        status: false,
        message: 'Selling price cannot be greater than MRP'
      });
    }

    const parsedIsReturnable = isReturnable === 'true' || isReturnable === true;
    if (parsedIsReturnable && (returnPolicyDays === undefined || returnPolicyDays === null)) {
      return res.status(400).json({
        status: false,
        message: 'Return policy days are required if product is returnable'
      });
    }

    const defaultImageFile = req.files?.defaultImage?.[0];
    const additionalImageFiles = req.files?.images || [];

    const updatedData = {
      name,
      description,
      mrp: mrp,
      sellingPrice: sellingPrice,
      discount: discount,
      category,
      subCategory,
      material,
      purity,
      weight: weight,
      stock: stock,
      featured: featured === 'true' || featured === true,
      gender,
      occasion: typeof occasion === 'string' ? occasion : Array.isArray(occasion) ? occasion[0] : '',
      warrantyInMonths: warrantyInMonths,
      isReturnable: parsedIsReturnable,
      returnPolicyDays: returnPolicyDays,
    };

    if (defaultImageFile) {
      updatedData.defaultImage = `/uploads/${defaultImageFile.filename}`;
    }

    if (additionalImageFiles.length > 0) {
      updatedData.images = additionalImageFiles.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: true,
      data: updatedProduct
    });

  } catch (err) {
    next(err);
  }
};