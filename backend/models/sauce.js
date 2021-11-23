const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manufacturer : { type: String, required: true },
  mainPepper : { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  heat: { type: Number, required: true },
  dislikes: { type: Number, default: 0},
  likes: { type: Number, default: 0},
  userDisliked: { type: [String] },
  userLiked: { type: [String] },
});

module.exports = mongoose.model('Thing', sauceSchema);