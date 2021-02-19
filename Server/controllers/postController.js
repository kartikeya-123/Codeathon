const Post = require('../models/postModel.js');
const catchAsync = require('./../utils/catchAsync.js');
const AppError = require('./../utils/appError'); // class//
const factory = require('./handlerFactory.js');
const { isLoggedIn } = require('./authController.js');

// getting all posts
exports.getAllPosts = factory.getAll(Post);

//creating post
exports.createPost = factory.createOne(Post);

//getting a certain post

exports.getPost = factory.getOne(Post);

// updating a post by only admin//

exports.updatePost = factory.updateOne(Post);

// a user can delete his posts//
exports.restrict = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') return next();

  const post = await Post.findById(req.params.id);

  if (post.User == req.user.id) return next();
  else
    return next(new AppError('Sorry you cannot access to this resource', 403));
});
exports.deletePost = factory.deleteOne(Post);

exports.BlacklistPost = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return next(new AppError('there is no post with this id', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'post has been successfully blacklisted by the admin',
  });
});

exports.upvotePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).select('upvotes');
  if (!post) {
    return next(new AppError('there is no post with this id', 400));
  }
  var i,
    flag = 0;
  for (i = 0; i < post.upvotedBy.length; i++) {
    if (post.upvotedBy[i]._id == req.user.id) {
      post.upvotedBy.splice(i, 1);
      flag = 1;
    }
  }
  if (flag === 0) post.upvotedBy.push(req.user.id);
  for (i = 0; i < post.downvotedBy.length; i++) {
    if (post.downvotedBy[i]._id == req.user.id) {
      post.downvotedBy.splice(i, 1);
    }
  }
  post.downvotes = post.downvotedBy.length;
  post.upvotes = post.upvotedBy.length;
  await post.save({ runValidators: false });
  res.status(200).json({
    status: 'success',
    message: 'post upvoted',
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    upvotedBy: post.upvotedBy,
    downvotedBy: post.downvotedBy,
  });
});

exports.downvotePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('there is no post with this id', 400));
  }
  var i,
    flag = 0;

  for (i = 0; i < post.downvotedBy.length; i++) {
    if (post.downvotedBy[i]._id == req.user.id) {
      post.downvotedBy.splice(i, 1);
      flag = 1;
    }
  }
  if (flag === 0) post.downvotedBy.push(req.user.id);

  for (i = 0; i < post.upvotedBy.length; i++) {
    if (post.upvotedBy[i]._id == req.user.id) {
      post.upvotedBy.splice(i, 1);
    }
  }

  post.downvotes = post.downvotedBy.length;
  post.upvotes = post.upvotedBy.length;
  await post.save({ runValidators: false });
  res.status(200).json({
    status: 'success',
    message: 'post downvoted',
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    upvotedBy: post.upvotedBy,
    downvotedBy: post.downvotedBy,
  });
});

exports.checkBlacklist = factory.checkBlacklist(Post);

exports.getUser = catchAsync(async (req, res, next) => {
  // const posts = await Post.find({ User: req.user.id });

  // res.status(200).json({
  //   status: 'success',
  //   total_posts: posts.length,
  //   data: {
  //     posts,
  //   },
  // });
  req.params.userId = req.user.id;
  next();
});

// exports.getPostsUser = factory.getAll()
