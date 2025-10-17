const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  firstAppearance: {
  type: String,
  trim: true,
},
  abilities: [{ type: String }],
  images: [{ type: String }]
});

module.exports = mongoose.model('Character', characterSchema);
