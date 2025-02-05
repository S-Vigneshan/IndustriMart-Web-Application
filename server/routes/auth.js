const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserProfile
} = require('../controllers/userController');

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUserProfile);

module.exports = router;
