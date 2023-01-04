const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String, require: true },
  category: { type: String, require: true }
},{
  timestamps: true,
});


module.exports = mongoose.model('Product', ProductSchema);


