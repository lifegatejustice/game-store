const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
  genres: [{ type: String }],
  platforms: [{ type: String }],
  releaseDates: [{
    region: { type: String },
    date: { type: Date }
  }],
  media: {
    cover: { type: String },
    screenshots: [{ type: String }],
    trailerUrl: { type: String }
  },
  price: { type: Number },
  stock: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);
