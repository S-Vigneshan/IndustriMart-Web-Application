const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount, payment } = req.body;

    // Create new order
    const order = new Order({
      user: req.body.userId || '645e2309b45a6145c8820d8d', // Temporary default user ID
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.variation.price
      })),
      shippingDetails,
      totalAmount,
      payment: {
        method: payment.method,
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

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, payhere_amount, payhere_currency, status_code } = req.body;

    // Verify the payment with PayHere status code
    if (status_code === 2) {
      // Payment successful
      await Order.findByIdAndUpdate(order_id, {
        'payment.status': 'Completed',
        'payment.orderId': payment_id
      });

      res.status(200).json({ success: true });
    } else {
      // Payment failed
      await Order.findByIdAndUpdate(order_id, {
        'payment.status': 'Failed'
      });

      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
};