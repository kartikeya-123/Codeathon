const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');
const factory = require('./../controllers/handlerFactory');
const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(authController.protect, postController.createPost);

router.patch(
  '/blacklist/:id',
  authController.protect,
  authController.restrictTo('admin'),
  postController.BlacklistPost
);
router.patch('/upvote/:id', authController.protect, postController.upvotePost);
router.patch(
  '/downvote/:id',
  authController.protect,
  postController.downvotePost
);
router.patch(
  '/edit/:id',
  authController.protect,
  postController.restrict,
  postController.updatePost
);
router.get(
  '/my-posts',
  authController.protect,
  postController.getUser,
  postController.getAllPosts
);
router.route('/:id').get(postController.checkBlacklist, postController.getPost);

router.delete(
  '/delete/:id',
  authController.protect,
  // authController.restrictTo('admin'),
  postController.restrict,
  postController.deletePost
);

module.exports = router;
