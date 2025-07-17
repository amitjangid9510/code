const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;
    const generatedOtp = crypto.randomInt(100000, 999999).toString();

    const userByPhone = await User.findOne({ phone });
    const userByEmail = await User.findOne({ email });

    if (
      userByPhone &&
      userByEmail &&
      userByPhone._id.toString() === userByEmail._id.toString() &&
      userByPhone.isVerified
    ) {
      return res.status(400).json({ success: false, message: 'User already registered. Please log in.' });
    }

    if (userByPhone?.isVerified && (!userByEmail || userByEmail._id.toString() !== userByPhone._id.toString())) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered.' });
    }

    if (userByEmail?.isVerified && (!userByPhone || userByEmail._id.toString() !== userByPhone._id.toString())) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }

    const unverifiedUser = userByPhone || userByEmail;
    if (unverifiedUser && !unverifiedUser.isVerified) {
      unverifiedUser.otp = generatedOtp;
      await unverifiedUser.save();

      // await sendOtp(unverifiedUser.phone, generatedOtp);
      console.log('sent OTP:', generatedOtp);

      return res.status(200).json({
        success: true,
        message: 'OTP sent again. Please verify your number to complete registration.'
      });
    }

    const newUser = new User({
      name,
      phone,
      email,
      password,
      otp: generatedOtp
    });

    await newUser.save();
    //await sendOtp(newUser.phone, generatedOtp);

    res.status(201).json({
      success: true, 
      message: 'User registered successfully. Please verify OTP sent to your phone.'
    });

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phone, email, password, otp } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ success: false, message: 'Please provide phone or email' });
    }

    const query = phone ? { phone } : { email };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'User is not verified. Please verify OTP first.' });
    }

    if (otp) {
      if (!user.otp || user.otp !== otp) {
        return res.status(401).json({ success: false, message: 'Invalid OTP' });
      }

      user.otp = null;
      await user.save();

    }else if (password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    }

    else {
      return res.status(400).json({ success: false, message: 'Please provide OTP or password' });
    }

    const token = createToken(user._id);

    res.cookie('authToken', token, {
      httpOnly: true,
      //secure: true, 
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });

  } catch (error) {
    next(error);
  }
};

exports.sendOtpForVerificationORLogin = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Indian phone number' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please sign up first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("sent OTP:",otp);
    
    user.otp = otp;
    await user.save();

   // await sendOtp(phone, otp);

    res.status(200).json({
      success: true,
      message: user.isVerified
        ? 'OTP resent for login'
        : 'OTP resent for verification'
    });

  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid Indian phone number' });
    }

    const user = await User.findOne({ phone });

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'Verified user with this phone not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();
    console.log("OTP send:",otp);
    
    //await sendOtp(phone, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your registered number for password reset',
    });

  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Phone, OTP, and new password are required' });
    }

    const user = await User.findOne({ phone });

    if (!user || !user.isVerified) {
      return res.status(404).json({ success: false, message: 'Verified user not found' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    user.password = newPassword;
    user.otp = null; 
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully' });

  } catch (error) {
    next(error);
  }
};

exports.verifyOtpForSignup = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = createToken(user._id);
    
    res.cookie('authToken', token, {
      httpOnly: true,
      //secure: true,
      sameSite: 'lax',
      maxAge: 7 *24 * 60 * 60 * 1000 
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully, you are now logged in',
      user
    });

  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    //secure: true,
    sameSite: 'lax',
  });
  res.status(200).json({success: true, message: 'Logged out successfully' });
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('authToken');
    res.status(200).json({success: true, message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};
