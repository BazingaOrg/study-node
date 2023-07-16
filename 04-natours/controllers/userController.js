const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates, Please use updatePassword',
        400,
      ),
    );
  }

  // 2) Update user document
  const filterBody = filterObj(req.body, 'name', 'email');
  const newUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This route is not supported',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This route is not supported',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This route is not supported',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failed',
    message: 'This route is not supported',
  });
};
