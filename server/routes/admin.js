const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
    getAllUsers
    
  } = require('../controllers/userController');

router.get("/users", authMiddleware, getAllUsers);

module.exports = router;