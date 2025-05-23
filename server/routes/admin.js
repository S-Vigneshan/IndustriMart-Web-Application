const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory} = require('../controllers/categoryController');
const { 
    getAllUsers,
    adminUpdateUser,
    adminDeleteUser
    
  } = require('../controllers/userController');

// Product routes
const productController = require('../controllers/productController');

const multer = require('multer');
const path = require('path');

// ...existing code...

router.get("/users", authMiddleware, getAllUsers);
router.put("/users/:id", authMiddleware, adminUpdateUser);
router.delete("/users/:id", authMiddleware, adminDeleteUser);
router.post("/categories", createCategory);  
router.get("/categories", getAllCategories);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Product routes

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/products', upload.array('images'), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.put('/products/:id', upload.array('images'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);


module.exports = router;