const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  try {
    const { date, time, service, stylist, customer } = req.body;
    
    // Check if time slot is already booked
    const existingBooking = await Booking.findOne({ 
      date, 
      time, 
      stylist,
      status: { $ne: 'cancelled' } 
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'This time slot is already booked for this stylist' 
      });
    }
    
    const booking = new Booking({ date, time, service, stylist, customer });
    const savedBooking = await booking.save();
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully', 
      data: savedBooking 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
});

// GET availability for a specific date
router.get('/availability/:date', async (req, res) => {
  try {
    const bookedSlots = await Booking.find({ 
      date: req.params.date, 
      status: { $ne: 'cancelled' } 
    }).select('time stylist');
    
    res.json({ 
      success: true, 
      date: req.params.date, 
      bookedSlots 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking availability', 
      error: error.message 
    });
  }
});

// PUT update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking updated successfully', 
      data: updatedBooking 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating booking', 
      error: error.message 
    });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error deleting booking', 
      error: error.message 
    });
  }
});

module.exports = router;
