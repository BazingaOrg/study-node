const express = require('express');

const {
  checkId,
  checkBody,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require(`${__dirname}/../controllers/tourController`);

const router = express.Router();

router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
