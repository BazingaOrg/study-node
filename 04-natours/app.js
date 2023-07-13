const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require(`${__dirname}/routes/tourRouter.js`);
const userRouter = require(`${__dirname}/routes/userRouter.js`);

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 自定义中间件
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
  // next();
});
app.use(globalErrorHandler);

module.exports = app;
