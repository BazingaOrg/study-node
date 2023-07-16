const express = require('express');

const {
  getAllUsers,
  updateMe,
  deleteMe,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require(`${__dirname}/../controllers/userController`);
const {
  signup,
  login,
  protect,
  forgetPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
