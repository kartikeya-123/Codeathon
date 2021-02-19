const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'A comment must have a description'],
  },
  author: {
    type: String,
    required: [true, 'A comment should belong to a user'],
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
