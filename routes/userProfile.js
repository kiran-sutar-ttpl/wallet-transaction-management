const express = require("express");
const router = express.Router();
const authController = require('../controller/auth/authController')
const { authenticateToken } = require('../middleware/authMiddleware')
const userProfileController = require('../controller/userProfile/userProfileController')

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);

router.get("/profile", authenticateToken, userProfileController.getUserProfile);
router.patch("/profile", authenticateToken, userProfileController.updateUserProfile);

module.exports = router;