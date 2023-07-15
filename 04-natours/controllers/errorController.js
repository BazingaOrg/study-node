const AppError = require('../utils/appError');

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or othen unknown error: don't leak error details
    // 1) Log error
    console.error('Error 💥', err);

    // 2) send generic error message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => new AppError(err.message, 401);

const handleTokenExpiredError = (err) => new AppError(err.message, 401);

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    const errorMapDB = new Map()
      .set('CastError', handleCastErrorDB)
      .set('MongoError', handleDuplicateFieldsDB)
      .set('ValidationError', handleValidationErrorDB)
      .set('JsonWebTokenError', handleJWTError)
      .set('TokenExpiredError', handleTokenExpiredError);
    errorMapDB.get(error.name) && (error = errorMapDB.get(error.name)(error));
    sendErrorProd(error, res);
  }
};
