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

    // Handle uploaded images with full URL
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (typeof req.body.defaultSizes === 'string') {
      req.body.defaultSizes = JSON.parse(req.body.defaultSizes);
    }
    req.body.allowCustomSize = req.body.allowCustomSize === 'true';

    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        altText: file.originalname
      }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
