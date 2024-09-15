const User = require('../models/userModel');
const authUtils = require('../utils/authUtils');

const createUser = async (userData) => {
  const { firstName, lastName ,email, password, emailAlerts } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with that email has already been registered!');
    error.code = 409;
    throw error;
  }
  let passwordDigest = await authUtils.hashPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: passwordDigest,
    emailAlerts,
  });
  return user;
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  let passwordMatched = await authUtils.comparePassword(user.password, password);
  if (!passwordMatched) {
    const error = new Error('Invalid credentials!');
    error.code = 400;
    throw error;
  }
  let payload = {
    id: user._id,
    email: user.email
  };
  let accessToken = authUtils.createAccessToken(payload);
  let refreshToken = authUtils.createRefreshToken(payload);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token not found!');
    error.code = 401;
    throw error;
  }
  const payload = authUtils.verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error('Invalid refresh token!');
    error.code = 401;
    throw error;
  }
  const newPayload = { id: payload.id, email: payload.email };
  const newAccessToken = authUtils.createAccessToken(newPayload);
  const newRefreshToken = authUtils.createRefreshToken(newPayload);
  user.refreshToken = newRefreshToken;
  await user.save();
  return { newAccessToken, newRefreshToken };
};

const logoutUser = async (refreshToken) => {
  const payload = authUtils.verifyRefreshToken(refreshToken);
  if (payload && payload.id) {
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }
};

const fetchUser = async (userId) => {
  const userProjection = {
    firstName: 1,
    lastName: 1,
    email: 1,
    emailAlerts: 1,
  };
  const user = await User.findById(userId, userProjection);
  if (!user) {
    const error = new Error('User not found!');
    error.code = 404;
    throw error;
  }
  return user;
};

// Mark a section as completed for a specific user
const markSectionCompleted = async (userId, sectionId) => {
  const user = await User.findById(userId);
  
  const courseProgress = user.coursesProgress.find(cp => 
    cp.course.modules.some(module => 
      module.sections.some(section => section._id.equals(sectionId))
    )
  );
  
  if (!courseProgress) throw new Error("Course progress not found");

  // Mark section as completed if not already done
  if (!courseProgress.completedSections.includes(sectionId)) {
    courseProgress.completedSections.push(sectionId);
  }

  // Update the progress percentage
  const totalSections = courseProgress.course.modules.reduce((acc, module) => acc + module.sections.length, 0);
  courseProgress.progress = (courseProgress.completedSections.length / totalSections) * 100;

  await user.save();
};

module.exports = {
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  fetchUser,
  markSectionCompleted,
};
