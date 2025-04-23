const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');

exports.createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        altText: file.originalname
      }));
    }

    // Parse defaultSizes if it's sent as a string (from FormData)
    if (typeof req.body.defaultSizes === 'string') {
      req.body.defaultSizes = JSON.parse(req.body.defaultSizes);
    }

    // Convert allowCustomSize to boolean (because FormData sends it as string)
    req.body.allowCustomSize = req.body.allowCustomSize === 'true';

    const product = new Product(req.body);
    const savedProduct = await product.save();
    await savedProduct.populate('category');
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add other CRUD operations as needed
