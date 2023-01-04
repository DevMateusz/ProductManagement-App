const UnverifiedProduct = require('../model/UnverifiedProduct');
const Product = require('../model/Product');
const Image = require('../model/Image');

const createProduct = async (req, res) => {
  const {title, description, price, image, category, productID} = req.body;
    if(title && description && price && image && category && productID){
      try {
        let newImage;
        if(image.includes('base64')){
          const contentType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
          const base64Image = image.split(",")[1];
          const rawImageData = Buffer.from(base64Image, "base64");
          newImage = await Image.create({data:rawImageData ,contentType});
        }
        const newUnverifiedProduct = await UnverifiedProduct.create({
          title,
          description,
          price,
          image: image.includes('base64') ? newImage._id : image,
          category,
          productID,
        })
        if (newUnverifiedProduct) {
          return res.status(201).json({message: "Product has been sent for verification"});
        } else {
          return res.status(500).json({message: "Product cannot be sent to verification"});
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create product to verification' });
      }
    }
    return res.status(400).json({message: "All input is required"});
}

const getProducts = async (req, res) => {
  const privileges = req.user.privileges
  if(privileges == 1){
    try {
      const unverifiedProducts = await UnverifiedProduct.find()
      if (!unverifiedProducts) {
        return res.status(404).json({ message: "Products not found" });
      }
      return res.status(200).json(unverifiedProducts)
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Products loading failed" });
    }
  }
}

const rejectProduct = async (req, res) => {
  const privileges = req.user.privileges
  const { id } = req.params
  if(privileges == 1){
    try {
      const deletedProduct = await UnverifiedProduct.findOneAndDelete({ _id: id })
      const originalProduct = await Product.findOne({ _id: deletedProduct.productID })
      if (originalProduct && originalProduct.image != deletedProduct.image) {
        await Image.findOneAndRemove({_id: deletedProduct.image})
      }
      return res.status(201).json({ message: 'Product has been rejected', id: id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to rejecteing product' });
    }
    
  }
  return res.status(403).json({ message: "Access denied" });
}

const acceptProduct = async (req, res) => {
  const privileges = req.user.privileges
  const { id } = req.params
  if(privileges == 1){
    try {
      const unverifyProduct = await UnverifiedProduct.findOne({ _id: id }).select('-_id -createdAt -updatedAt -__v ')
      if(unverifyProduct) {
        const product = await Product.findOne({_id: unverifyProduct.productID})
        if (product.image != unverifyProduct.image) {
          await Image.findOneAndDelete({_id: product.image})
        }
        await Product.findOneAndUpdate({ _id: unverifyProduct.productID }, unverifyProduct)
        await UnverifiedProduct.findOneAndRemove({ _id: id })
        return res.status(201).json({ message: 'Product has been accepted', id: id });
      }
      return res.status(500).json({ message: 'Product does not exist' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to accepting product' });
    }
    
  }
  return res.status(403).json({ message: "Access denied" });
}



module.exports = { getProducts, createProduct, rejectProduct, acceptProduct };