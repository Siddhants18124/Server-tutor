const express = require('express');
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to mark a section as completed
router.post('/:sectionId/mark-completed', authMiddleware.authenticateRequest, sectionController.markSectionCompleted);

module.exports = router;
