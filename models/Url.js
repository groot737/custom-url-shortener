const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  key: String,
  long_url: String,
  short_url: String,
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
