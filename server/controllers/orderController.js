const Order = require('../models/order');
const Product = require('../models/product'); // Add this line

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingDetails, totalAmount, payment } = req.body;

    // Check and update stock for default sized items
    for (const item of items) {
      // Only process stock update for non-custom size items
      if (!item.variation.isCustom) {
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        // Find the specific size in defaultSizes array
        const sizeObj = product.defaultSizes.find(s => s.size === item.variation.size);
        if (!sizeObj) {
          throw new Error(`Size ${item.variation.size} not found for product ${item.name}`);
        }

        // Check if enough stock is available
        if (sizeObj.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name} in size ${item.variation.size}. Available: ${sizeObj.stock}, Requested: ${item.quantity}`);
        }

        // Update stock only for the selected size
        try {
          await product.updateStock(item.variation.size, item.quantity);
        } catch (stockError) {
          throw new Error(`Stock update failed for ${item.name}: ${stockError.message}`);
        }
      }
    }

    // Create new order
    const order = new Order({
      user: req.body.userId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.variation.price,
        variation: {
          size: item.variation.size,
          price: item.variation.price,
          isCustom: item.variation.isCustom
        }
      })),
      shippingDetails,
      totalAmount,
      payment: {
        method: payment.method,
        status: 'Pending'
      }
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating order'
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