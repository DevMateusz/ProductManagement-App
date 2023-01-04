const Image = require('../model/Image');

const getImage = async (req, res) => {
  const { id } = req.params
  try {
    const image = await Image.findOne({ _id: id })
    res.contentType(image.contentType)
    res.send(image.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image loading failed" });
  }
}

module.exports = { getImage };