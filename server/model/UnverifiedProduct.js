const mongoose = require('mongoose');

const UnverifiedProductSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String },
  category: { type: String, require: true },
  productID: { type: String, require: true }
},{
  timestamps: true,
});


module.exports = mongoose.model('UnverifiedProduct', UnverifiedProductSchema);


