const express = require("express");
const router = express.Router();
const authController = require('../controller/auth/authController')
const { authenticateToken } = require('../middleware/authMiddleware')
const transactionController = require('../controller/transaction/transactionController')
const keloWalletController = require('../controller/keloWallet/keloWalletController')

router.get("/", authenticateToken, keloWalletController.getTransactionList);
router.post("/", authenticateToken, keloWalletController.createTransaction);
router.get("/:transferId", authenticateToken, keloWalletController.getTransaction);

module.exports = router;