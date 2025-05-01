const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/products', upload.array('images'), productController.createProduct);
router.delete('/products/:id', productController.deleteProduct);
router.put('/products/:id', upload.array('images'), productController.updateProduct);

module.exports = router;