const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create order route - remove auth middleware temporarily for testing
router.post('/', orderController.createOrder);
router.post('/:id/verify', orderController.verifyPayment);


module.exports = router;