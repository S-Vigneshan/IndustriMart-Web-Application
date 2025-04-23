const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserProfile,
  updatePassword
  
} = require('../controllers/userController');

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUserProfile);


//update password
router.post('/update-password', updatePassword);


module.exports = router;
