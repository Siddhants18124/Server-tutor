const express = require('express');
const UserRoutes = require('./userRoutes');
const CourseRoutes = require('./courseRoutes');  // Import Course routes
const SectionRoutes = require('./sectionRoutes'); // Import Section routes

const router = express.Router();

// Set up routes
router.use('/user', UserRoutes);
router.use('/courses', CourseRoutes);  // Use Course routes
router.use('/sections', SectionRoutes);  // Use Section routes

module.exports = router;
