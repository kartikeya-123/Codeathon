const Post = require('../models/postModel.js');
const Comment = require('../models/commentModel.js');
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

exports.commentPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('This post is not available ', 404));
  }

  if (!req.body.comment) {
    return next(new AppError('There is no comment ', 404));
  }

  const comment = await Comment.create({
    comment: req.body.comment,
    author: req.user.name,
  });

  if (post.Comments === null || post.Comments === undefined)
    post.Comments = [comment];
  else post.Comments.push(comment._id);

  await post.save({ runValidators: false });
  const updatedPost = await Post.findById(req.params.id);

  console.log(updatedPost);

  res.status(200).json({
    status: 'success',
    updatedPost,
  });
});
// exports.getPostsUser = factory.getAll()

exports.reportPost = catchAsync(async (req, res, next) => {
  const reportedPost = await Post.findById(req.params.id);

  if (!reportedPost) {
    return next(new AppError('The Post with this id is not present', 403));
  }

  if (reportedPost.reporters && reportedPost.reporters.includes(req.user.id)) {
    res.status(200).json({
      status: 'success',
      message: 'This post is already reported by you',
    });
  } else {
    const newReportCount = reportedPost.reportCount + 1;
    let blacklistStatus = false;
    if (newReportCount > 10) {
      blacklistStatus = true;
      // await sendEmail({
      //   email: reportedPost.email,
      //   subject: `Your profile has been unpublished.`,
      //   message: `Hey Your post  been ${reportedPost.title} has been blaclisted due to excessive reports.\nContact admin for republishing it.`,
      //   attachments: [],
      // });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      reportCount: newReportCount,
      Blacklist: blacklistStatus,
      $push: { reporters: req.user._id },
    });

    res.status(200).json({
      status: 'Success',
      message: 'The post has been successfully reported',
      data: reportedPost,
    });
  }
});
