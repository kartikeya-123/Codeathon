const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const factory = require('./../controllers/handlerFactory');
const router = express.Router();
// const userController = require('./../controllers/authController');
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/signup/:token', authController.signupVerification);
// router.use(userController.BlacklistUser);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);

router.delete('/deleteMe', userController.deletMe);

router.get('/me', userController.getMe, userController.getUser);

router.get('/loginStatus', authController.isLoggedIn);

router.get('/logout', authController.logout);

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
