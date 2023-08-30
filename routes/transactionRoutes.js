const express = require("express");
const router = express.Router();
const authController = require('../controller/auth/authController')
const { authenticateToken } = require('../middleware/authMiddleware')
const transactionController = require('../controller/transaction/transactionController')

router.get("/", authenticateToken, transactionController.getTransactionList);
router.post("/", authenticateToken, transactionController.createTransaction);
router.get("/:transactionId", authenticateToken, transactionController.getTransaction);

module.exports = router;