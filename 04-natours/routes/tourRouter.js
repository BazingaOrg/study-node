const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// router.param('id', checkId);

// POST /tour/afsdf6461/reviews
// GET /tour/afsdf6461/reviews
// GET /tour/afsdf6461/reviews/saddfas12
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo(['admin', 'lead-guide']),
    tourController.deleteTour,
  );
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

module.exports = router;
