const express = require('express');
const morgan = require('morgan');

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

module.exports = app;
