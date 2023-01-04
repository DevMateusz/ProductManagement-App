const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const unverifiedProductController = require('../../controllers/unverifiedProductController');

router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/', productController.createProduct);
router.post('/verify', unverifiedProductController.createProduct);
router.post('/:id/accept', unverifiedProductController.acceptProduct);
router.post('/:id/reject', unverifiedProductController.rejectProduct);




module.exports = router;