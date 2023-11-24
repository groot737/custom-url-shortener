const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  key: String,
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Url' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
