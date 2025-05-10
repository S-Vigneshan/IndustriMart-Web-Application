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

module.exports = mongoose.model('Product', productSchema);
