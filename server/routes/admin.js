const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory} = require('../controllers/categoryController');
const { 
    getAllUsers
    
  } = require('../controllers/userController');

router.get("/users", authMiddleware, getAllUsers);
router.post("/categories", createCategory);  
router.get("/categories", getAllCategories);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;