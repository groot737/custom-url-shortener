const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  key: String,
  long_url: String,
  short_url: String,
  isActive: Boolean,
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
