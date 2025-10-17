const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  oauthId: { type: String, required: true },
  provider: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
