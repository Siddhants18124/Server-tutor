// const userService = require('../services/userService');

// const Register = async (req, res, next) => {
//   try {
//     const data = { ...req.body };
//     const user = await userService.createUser(data);
//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     next(error)
//   }
// };

// const Login = async (req, res, next) => {
//   try {
//     const data = { ...req.body };
//     const { accessToken, refreshToken } = await userService.loginUser(data);
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'Strict'
//     });
//     res.status(200).json({ token: accessToken });
//   } catch (error) {
//     next(error);
//   }
// };

// const RefreshToken = async (req, res, next) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;
//     const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken);
//     res.cookie('refreshToken', newRefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'Strict'
//     });
//     res.status(200).json({ token: newAccessToken });
//   } catch (error) {
//     next(error);
//   }
// };

// const Logout = async (req, res, next) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;
//     if (refreshToken) {
//       await userService.logoutUser(refreshToken);
//     }
//     res.clearCookie('refreshToken', {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'Strict'
//     });
//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

// const FetchUserInfo = async (req, res, next) => {
//   try {
//     const userId = req.user?.id;
//     const user = await userService.fetchUser(userId);
//     res.status(200).json({ user });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   Register,
//   Login,
//   RefreshToken,
//   Logout,
//   FetchUserInfo,
// };


const userService = require('../services/userService');

// User Registration
const Register = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const user = await userService.createUser(data);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    next(error);
  }
};

// User Login
const Login = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { accessToken, refreshToken } = await userService.loginUser(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).json({ token: accessToken });
  } catch (error) {
    next(error);
  }
};

// Refresh Token
const RefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// Logout
const Logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await userService.logoutUser(refreshToken);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Fetch User Info and Course Progress
const FetchUserInfo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await userService.fetchUser(userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Mark Section as Complete (Course Progress)
const MarkSectionComplete = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { courseId, sectionTitle } = req.body;

    await userService.markSectionComplete(userId, courseId, sectionTitle);

    res.status(200).json({ message: 'Section marked as complete' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Register,
  Login,
  RefreshToken,
  Logout,
  FetchUserInfo,
  MarkSectionComplete, // New route to mark sections complete
};
