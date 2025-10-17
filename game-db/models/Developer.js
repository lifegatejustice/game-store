const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foundedYear: { type: Number },
  country: { type: String },
  website: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Developer', developerSchema);
