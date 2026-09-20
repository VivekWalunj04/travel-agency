const express = require('express');
const Package = require('../models/Package');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/packages
 * @desc    Get all active packages with optional search & filters
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      location,
      sort = '-createdAt',
      page  = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Package.countDocuments(query);

    const packages = await Package.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      packages,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/packages/:id
 * @desc    Get single package by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('createdBy', 'name');
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/packages
 * @desc    Create a new travel package
 * @access  Private/Admin
 */
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const pkg = await Package.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(pkg);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/packages/:id
 * @desc    Update a travel package
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/packages/:id
 * @desc    Soft-delete a travel package (set isActive: false)
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package removed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
