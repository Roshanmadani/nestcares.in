const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const dbHelper = require('../utils/dbHelper');
const { protect } = require('../middleware/auth');

// Helper to generate a slug from service name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { includeHidden } = req.query;
    const filter = includeHidden === 'true' ? {} : { active: true };
    const services = await dbHelper.find(Service, filter, { displayOrder: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get single service by slug
// @route   GET /api/services/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const service = await dbHelper.findOne(Service, { slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { 
    title, shortDescription, fullDescription, bannerImage, galleryImages, 
    benefits, subServices, faqs, price, bookable, active, icon, preparationInstructions 
  } = req.body;

  try {
    if (!title || !shortDescription || !fullDescription) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const slug = slugify(title);
    
    // Check if slug already exists
    const existing = await dbHelper.findOne(Service, { slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A service category with this name already exists' });
    }

    // Get the current max displayOrder to place this service at the end
    const services = await dbHelper.find(Service, {});
    const maxOrder = services.reduce((max, s) => (s.displayOrder > max ? s.displayOrder : max), -1);

    const newService = await dbHelper.create(Service, {
      title,
      slug,
      shortDescription,
      fullDescription,
      bannerImage: bannerImage || '',
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      subServices: Array.isArray(subServices) ? subServices : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      price: Number(price) || 0,
      bookable: bookable !== undefined ? bookable : true,
      active: active !== undefined ? active : true,
      displayOrder: maxOrder + 1,
      icon: icon || 'Heart',
      preparationInstructions: preparationInstructions || ''
    });

    res.status(201).json({ success: true, data: newService });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Reorder services (drag & drop)
// @route   PUT /api/services/reorder/list
// @access  Private/Admin
// Must be registered before PUT /:id, otherwise "reorder" is matched as an id.
router.put('/reorder/list', protect, async (req, res) => {
  const { orderedIds } = req.body;

  try {
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds array is required' });
    }

    // Update displayOrder for each service ID
    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await dbHelper.findByIdAndUpdate(Service, id, { displayOrder: index });
    }

    res.json({ success: true, message: 'Services reordered successfully' });
  } catch (error) {
    console.error('Error reordering services:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { 
    title, shortDescription, fullDescription, bannerImage, galleryImages, 
    benefits, subServices, faqs, price, bookable, active, displayOrder, icon, preparationInstructions 
  } = req.body;

  try {
    let service = await dbHelper.findById(Service, req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const updateFields = {};
    if (title) {
      updateFields.title = title;
      updateFields.slug = slugify(title);
    }
    if (shortDescription) updateFields.shortDescription = shortDescription;
    if (fullDescription) updateFields.fullDescription = fullDescription;
    if (bannerImage !== undefined) updateFields.bannerImage = bannerImage;
    if (galleryImages) updateFields.galleryImages = Array.isArray(galleryImages) ? galleryImages : [];
    if (benefits) updateFields.benefits = Array.isArray(benefits) ? benefits : [];
    if (subServices) updateFields.subServices = Array.isArray(subServices) ? subServices : [];
    if (faqs) updateFields.faqs = Array.isArray(faqs) ? faqs : [];
    if (price !== undefined) updateFields.price = Number(price) || 0;
    if (bookable !== undefined) updateFields.bookable = bookable;
    if (active !== undefined) updateFields.active = active;
    if (displayOrder !== undefined) updateFields.displayOrder = Number(displayOrder);
    if (icon !== undefined) updateFields.icon = icon;
    if (preparationInstructions !== undefined) updateFields.preparationInstructions = preparationInstructions;

    const updatedService = await dbHelper.findByIdAndUpdate(Service, req.params.id, updateFields);

    res.json({ success: true, data: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await dbHelper.findById(Service, req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await dbHelper.findByIdAndDelete(Service, req.params.id);
    res.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
