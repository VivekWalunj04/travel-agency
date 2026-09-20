const express = require('express');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      packageId,
      bookingDate,
      travelers,
      specialRequests,
      contactPhone,
    } = req.body;

    // Validate package exists
    const pkg = await Package.findById(packageId);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ message: 'Package not found or no longer available' });
    }

    // Calculate total
    const totalAmount = pkg.price * (travelers || 1);

    const booking = await Booking.create({
      user:            req.user._id,
      package:         packageId,
      bookingDate,
      travelers:       travelers || 1,
      totalAmount,
      specialRequests: specialRequests || '',
      contactName:     req.user.name,
      contactEmail:    req.user.email,
      contactPhone:    contactPhone || '',
    });

    await booking.populate(['user', 'package']);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/bookings/user/:userId
 * @desc    Get all bookings for a specific user
 * @access  Private
 */
router.get('/user/:userId', protect, async (req, res, next) => {
  try {
    // Users can only see their own bookings; admins can see any
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate('package', 'title imageUrl location duration price')
      .sort('-createdAt');

    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (admin only)
 * @access  Private/Admin
 */
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const total    = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user',    'name email')
      .populate('package', 'title location price')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status (admin)
 * @access  Private/Admin
 */
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['user', 'package']);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the booking owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
