const Product = require('../models/product');
const Category = require('../models/category');

exports.createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

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
