const router = require("express").Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const userSchemas = require('../validationSchemas/userSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post(
  "/register",
  validationMiddleware.validateRequest(userSchemas.registerSchema),
  controller.Register
);

router.post(
  "/login",
  validationMiddleware.validateRequest(userSchemas.loginSchema),
  controller.Login
);

router.post(
  "/refresh-token",
  controller.RefreshToken
);

router.post(
  "/logout",
  controller.Logout
);

router.post(
  "/mark-section-complete",
  authMiddleware.authenticateRequest,
  controller.MarkSectionComplete
);

router.get(
  "/fetch-user-info",
  authMiddleware.authenticateRequest,
  controller.FetchUserInfo
);



module.exports = router;
