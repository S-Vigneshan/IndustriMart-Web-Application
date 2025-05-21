const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create order route - remove auth middleware temporarily for testing
router.post('/', orderController.createOrder);
router.post('/:id/verify', orderController.verifyPayment);
router.get('/:id', orderController.getOrderById); // Add this new route
router.get('/user/:userId', orderController.getUserOrders);
// ...existing code...
router.get('/', orderController.getAllOrders);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;