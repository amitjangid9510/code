const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search;
    const filters = {};

    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: 'i' };
    }
    if (req.query.email) {
      filters.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.phone) {
      filters.phone = { $regex: req.query.phone };
    }
    if (req.query.isVerified !== undefined) {
      filters.isVerified = req.query.isVerified === 'true';
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search } }
      ];
    }

    const sort = req.query.sortBy || '-createdAt';

    const users = await User.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password -otp');

    const total = await User.countDocuments(filters);

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const updates = req.body;
    console.log("🚀 ~ exports.updateUser= ~ updates:", updates)
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No update fields provided' });
    }

    const restrictedFields = ['_id', 'otp', 'isVerified', 'createdAt', 'updatedAt'];
    for (const field of restrictedFields) {
      if (field in updates) {
        return res.status(400).json({ success: false, message: `Cannot update field: ${field}` });
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      updates.passwordChangedAt = new Date();
    }

    const allowedTopLevelFields = ['name', 'phone', 'email', 'password', 'passwordChangedAt', 'gender', 'age', 'jewelleryInterests', 'address'];
    for (const key of Object.keys(updates)) {
      if (!allowedTopLevelFields.includes(key)) {
        return res.status(400).json({ success: false, message: `Field not allowed to update: ${key}` });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (updates.address) {
      const addressInput = updates.address;

      if (addressInput.action === 'add') {
        if (addressInput.isDefault) {
          user.address.forEach(addr => addr.isDefault = false);
        }
        user.address.push(addressInput);
      }

      else if (addressInput.action === 'update' && addressInput._id) {
        const index = user.address.findIndex(a => a._id.toString() === addressInput._id);
        if (index === -1) {
          return res.status(404).json({ success: false, message: 'Address not found' });
        }

        if (addressInput.isDefault) {
          user.address.forEach(addr => addr.isDefault = false);
        }

        user.address[index] = {
          ...user.address[index].toObject(),
          ...addressInput
        };
      }

      else if (addressInput.action === 'delete' && addressInput._id) {
        user.address = user.address.filter(a => a._id.toString() !== addressInput._id);
      }

      else {
        return res.status(400).json({ success: false, message: 'Invalid address action or _id missing' });
      }

      delete updates.address;
    }

    for (const key of Object.keys(updates)) {
      user[key] = updates[key];
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ message: 'Product already in wishlist' });
  }

  user.wishlist.push(productId);
  await user.save();

  res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.wishlist = user.wishlist.filter(
    id => id.toString() !== productId.toString()
  );
  await user.save();

  res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
};

exports.getWishlist = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate('wishlist');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ wishlist: user.wishlist });
};
