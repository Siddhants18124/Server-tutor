const userService = require('../services/userService');

// Mark section as completed for the logged-in user
const markSectionCompleted = async (req, res, next) => {
  try {
    const { sectionId } = req.params;
    const userId = req.user.id; // Get the logged-in user's ID
    await userService.markSectionCompleted(userId, sectionId);
    res.status(200).json({ message: "Section marked as completed!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markSectionCompleted,
};
