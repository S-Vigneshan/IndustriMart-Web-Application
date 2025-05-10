const Product = require('../models/product');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');
const { log } = require('console');

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
    const updateData = { ...req.body };

    // Parse defaultSizes
    if (typeof updateData.defaultSizes === 'string') {
      updateData.defaultSizes = JSON.parse(updateData.defaultSizes);
    }

    // Parse existing images
    if (typeof updateData.existingImages === 'string') {
      updateData.images = JSON.parse(updateData.existingImages);
    }

    // Convert boolean and number fields
    updateData.allowCustomSize = updateData.allowCustomSize === 'true';
    updateData.perMeterPrice = updateData.allowCustomSize ? Number(updateData.perMeterPrice) : 0;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `http://localhost:5000/uploads/${file.filename}`,
        altText: file.originalname
      }));
      
      updateData.images = [...(updateData.images || []), ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Error updating product',
      error: error.message 
    });
  }
};
