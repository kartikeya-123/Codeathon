const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post must contain a title'],
    },
    slug: String,
    author: {
      type: String,
    },
    // body: {
    //   type: String,
    //   required: [true, 'A post should contain info'],
    // },
    upvotedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    downvotedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    reportCount: {
      type: Number,
      default: 0,
    },
    reporters: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    data: {
      type: String,
      required: [true, 'A post should contain info'],
    },
    tags: [
      {
        type: String,
      },
    ],
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    Blacklist: {
      type: Boolean,
      default: false,
    },
    User: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    Comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// populating the user for every post
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'upvotedBy',
    select: 'name',
  })
    .populate({
      path: 'downvotedBy',
      select: 'name',
    })
    .populate({
      path: 'Comments',
      select: 'comment author',
      options: { sort: { createdAt: -1 } },
    });

  next();
});

// postSchema.pre('save', function (req, res, next) {
//   // this.User = req.user.id;
//   // this.author = req.user.name;
//   console.log(this.body);
//   next();
// });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;