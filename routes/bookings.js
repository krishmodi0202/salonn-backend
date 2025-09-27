const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/booking');

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
  try {
    const { date, time, service, stylist, customer } = req.body;

    console.log('📝 Creating booking:', { date, time, service, stylist, customer: customer?.name });
    console.log(`📊 MongoDB connection state: ${mongoose.connection.readyState}`);

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 Creating mock booking - database not connected');
      
      // Return mock booking data for development
      const mockBooking = {
        _id: 'mock_' + Date.now(),
        date,
        time,
        service,
        stylist,
        customer,
        status: 'confirmed',
        bookingId: 'BK' + Date.now() + Math.floor(Math.random() * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        note: 'Development mode - database not connected'
      };

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully (development mode)',
        data: mockBooking
      });
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      date,
      time,
      stylist: stylist !== 'any' ? stylist : { $exists: true },
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create new booking
    const booking = new Booking({
      date,
      time,
      service,
      stylist,
      customer
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });

  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// GET /api/bookings/availability/:date - Check availability for a specific date
router.get('/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    console.log(`🔍 Checking availability for date: ${date}`);
    console.log(`📊 MongoDB connection state: ${mongoose.connection.readyState}`);
    console.log(`📊 Database name: ${mongoose.connection.name}`);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected, readyState:', mongoose.connection.readyState);
      console.log('🔄 Returning empty availability for development');
      
      // Return empty availability for development when DB is not connected
      return res.json({
        success: true,
        date,
        bookedSlots: [], // Empty array means all slots are available
        count: 0,
        note: 'Development mode - database not connected'
      });
    }
    
    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error('❌ Invalid date format:', date);
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD',
        providedDate: date
      });
    }
    
    console.log(`🔍 Querying bookings for date: ${date}`);
    
    const bookedSlots = await Booking.find({
      date,
      status: { $ne: 'cancelled' }
    }).select('time stylist');

    console.log(`✅ Found ${bookedSlots.length} booked slots for ${date}`);
    console.log(`📋 Booked slots:`, bookedSlots);

    res.json({
      success: true,
      date,
      bookedSlots,
      count: bookedSlots.length
    });

  } catch (error) {
    console.error('❌ Error in availability route:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message,
      errorName: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/bookings/:id - Get specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

module.exports = router;
