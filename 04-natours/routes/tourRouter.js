const express = require('express');

const {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require(`${__dirname}/../controllers/tourController`);
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// router.param('id', checkId);
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo(['admin', 'lead-guide']), deleteTour);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

module.exports = router;
