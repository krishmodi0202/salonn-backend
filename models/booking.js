const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  service: { 
    type: String, 
    required: true 
  },
  stylist: { 
    type: String, 
    required: true 
  },
  customer: {
    name: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      default: '' 
    },
    whatsapp: { 
      type: String, 
      default: '' 
    }
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed'
  },
  bookingId: {
    type: String,
    unique: true,
    default: function() {
      return 'BK' + Date.now() + Math.floor(Math.random() * 1000);
    }
  },
  notes: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Add index for better query performance
bookingSchema.index({ date: 1, time: 1, stylist: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'customer.phone': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
