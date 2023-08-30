const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware')
const walletController = require('../controller/wallet/walletController')

router.get("/", authenticateToken, walletController.getWalletDetails);
router.patch("/", authenticateToken, walletController.updateWalletDetails);

module.exports = router;