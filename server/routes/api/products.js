const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const unverifiedProductController = require('../../controllers/unverifiedProductController');

router.get('/products%20to%20confirm', unverifiedProductController.getProducts);
router.get('/:category', productController.getProducts);

module.exports = router;



