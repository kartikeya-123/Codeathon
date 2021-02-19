const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  hashedToken: String,
  tokenExpiresAt: Date,
  user: String,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
