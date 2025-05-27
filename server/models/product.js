const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  defaultSizes: [{ 
    size: String,
    price: Number,
    stock: { type: Number, default: 0 } // Add stock field
    
  }],
  perMeterPrice: { type: Number, default: 0 },
  allowCustomSize: { type: Boolean, default: false },
  images: [{ 
    url: String,
    altText: String
  }],
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

// Add this to populate category details when querying products
productSchema.pre('find', function() {
  this.populate('category');
});

// Method to update stock after order
productSchema.statics.updateStockOnOrder = async function(orderItems) {
  for (const item of orderItems) {
    if (!item.productId) {
      throw new Error(`Missing product ID in order item: ${JSON.stringify(item)}`);
    }

    const product = await this.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found with id: ${item.productId}`);
    }

    const sizeIndex = product.defaultSizes.findIndex(
      s => s.size === item.variation.size
    );

    if (sizeIndex === -1) {
      throw new Error(`Size ${item.variation.size} not found for product ${product.name}`);
    }

    if (product.defaultSizes[sizeIndex].stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name} in size ${item.variation.size}`);
    }

    // Decrease the stock
    product.defaultSizes[sizeIndex].stock -= item.quantity;
    await product.save();
  }
};

module.exports = mongoose.model('Product', productSchema);
