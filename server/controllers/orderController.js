const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount, payment } = req.body;

    // Create new order    // Format items to include correct productId
    const formattedItems = items.map(item => ({
      productId: item.id, // Store the product ID
      name: item.name,
      quantity: item.quantity,
      price: item.variation.price,
      variation: {
        size: item.variation.size,
        price: item.variation.price
      }
    }));

    const order = new Order({
      user: req.body.userId || '645e2309b45a6145c8820d8d', // Temporary default user ID
      items: formattedItems,
      shippingDetails,
      totalAmount,
      payment: {
        method: payment.method,
        status: 'Pending'
      }
    });    // Save the order
    const savedOrder = await order.save();    // Update product stock after successful order
    try {
      await Product.updateStockOnOrder(formattedItems);
    } catch (error) {
      // If stock update fails, delete the order and throw error
      await Order.findByIdAndDelete(savedOrder._id);
      throw new Error(`Stock update failed: ${error.message}`);
    }

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
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};