const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount, userId } = req.body;

    // Create new order
    const order = new Order({
      user: userId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.variation.price
      })),
      shippingDetails,
      totalAmount,
      payment: {
        method: 'Cash on Delivery', // Default payment method
        status: 'Pending'
      }
    });

    // Save the order
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};