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
// Add this method to the productSchema
productSchema.methods.updateStock = async function(size, quantity) {
  const sizeIndex = this.defaultSizes.findIndex(s => s.size === size);
  
  if (sizeIndex === -1) {
    throw new Error(`Size ${size} not found in product ${this.name}`);
  }

  // Only update the stock for the specific size
  this.defaultSizes[sizeIndex].stock -= quantity;
  
  if (this.defaultSizes[sizeIndex].stock < 0) {
    throw new Error(`Insufficient stock for size ${size}. Required: ${quantity}, Available: ${this.defaultSizes[sizeIndex].stock + quantity}`);
  }

  // Save the changes
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
