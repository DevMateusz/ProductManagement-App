const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, require: true, lowercase: true },
  password: { type: String, require: true },
  privileges: { type: Number, require: true, default: 0 },
  token: { type: String },
},{
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);