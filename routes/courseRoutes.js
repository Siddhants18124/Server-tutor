const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Route to generate a course based on the language input
router.post('/generate',authMiddleware.authenticateRequest, courseController.generateCourse);

// Route to fetch all modules (or courses) for a user
router.get('/modules', authMiddleware.authenticateRequest, courseController.getAllModules);

// Route to fetch a specific module by its ID
router.get('/:moduleId', authMiddleware.authenticateRequest, courseController.getModuleDetails);

module.exports = router;
