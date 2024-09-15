const courseService = require('../services/courseService');
const mongoose = require('mongoose');

// Generate course and save it to the database
const generateCourse = async (req, res, next) => {
  try {
    const { language } = req.body;
    const userId = req.user.id; // From auth middleware
    const course = await courseService.generateCourse(userId, language);
    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

// Get all modules (or courses) for the logged-in user
const getAllModules = async (req, res, next) => {
  try {
    const userId = req.user.id; // From auth middleware
    const modules = await courseService.getAllModules(userId);
    res.status(200).json({ modules });
  } catch (error) {
    next(error);
  }
};

const getModuleDetails = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    console.log("________________________")
    console.log(moduleId);
    console.log("________________________")
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({ error: 'Invalid module ID format' });
    }
    
    // Fetch module details
    const module = await courseService.getModuleDetails(moduleId);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.status(200).json({ module });
  } catch (error) {
    console.log("Error code: " + error);
    next(error);
  }
};




module.exports = {
  generateCourse,
  getAllModules,
  getModuleDetails,
};
