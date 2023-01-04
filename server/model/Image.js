const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  productID: String
  });

module.exports = mongoose.model('Image', ImageSchema);


