const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_In,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exsit
  if (!email || !password) {
    return next(new AppError('Please  provide email and password', 400));
  }
  // 2) Check ifuser exsits and password correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  // 3) If everything is ok then send token to the client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access!', 401),
    );
  }

  // 2) Verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exsits
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exists.',
        401,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (await freshUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError(
        'User recently changed the password! Please log in again',
        401,
      ),
    );
  }

  // Grant access to protected routes
  req.user = freshUser;
  next();
});
