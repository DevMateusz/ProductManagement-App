const Product = require('../model/Product');
const Image = require('../model/Image');


const getProducts = async (req, res) => {
  const { category } = req.params
  const privileges = req.user.privileges
  if(category == "products to confirm" && privileges != 1){
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    let products;
    if (category == "all") {
      products = await Product.find()
    } else {
      products = await Product.find({ category: category })
    }
    
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    return res.status(200).json(products)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product loading failed" });
  }
}

const createProduct = async (req, res) => {
  const privileges = req.user.privileges
  const {title, description, price, image, category} = req.body;
  if(privileges == 1){
    if(title && description && price && image && category){
      try {
        const contentType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
        const base64Image = image.split(",")[1];
        const rawImageData = Buffer.from(base64Image, "base64");

        const newImage = await Image.create({data:rawImageData ,contentType});
        const newProduct = await Product.create({
          title,
          description,
          price,
          image: newImage._id,
          category,
        })
        await Image.updateOne({_id: newImage._id}, {
          productID: newProduct._id, 
        })
        if (newProduct) {
          return res.status(201).json(newProduct);
        } else {
          return res.status(500).json({message: "Product cannot be saved"});
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create product' });
      }
    }
    return res.status(400).json({message: "All input is required"});
  }
  return res.status(403).json({ message: "Access denied" });
}

const deleteProduct = async (req, res) => {
  const privileges = req.user.privileges
  const { id } = req.params
  if(privileges == 1){
    try {
      const deletedProduct = await Product.findOneAndDelete({ _id: id })
      await Image.findOneAndRemove({_id: deletedProduct.image});
      return res.status(201).json({ message: 'Product has been deleted', id: id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to deleting product' });
    }
    
  }
  return res.status(403).json({ message: "Access denied" });
}

const updateProduct = async (req, res) => {
  const privileges = req.user.privileges
  const {title, description, price, image, category} = req.body;
  const { id } = req.params
  if(privileges == 1){
    try {
      let newImage;
      if(image.includes('base64')){
        const contentType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
        const product = await Product.findOne({_id: id})
        const base64Image = image.split(",")[1];
        const rawImageData = Buffer.from(base64Image, "base64");
        await Image.findOneAndRemove({_id: product.image });
        newImage = await Image.create({data:rawImageData ,contentType});
      }
      const updatedProduct = await Product.findOneAndUpdate({ _id: id }, {title, description, image: image.includes('base64') ? newImage._id : image.split('/').pop(), price, category})
      return res.status(201).json(updatedProduct);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to updating product' });
    }
    
  }
  return res.status(403).json({ message: "Access denied" });
}

const getProduct = async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product loading failed" });
  }
}



module.exports = { getProducts, createProduct, getProduct, updateProduct, deleteProduct };