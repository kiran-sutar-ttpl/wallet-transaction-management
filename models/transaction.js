const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

var TransactionSchema = new mongoose.Schema({
  from_user_id: String,
  to_user_id: String,
  amount: Number,
  status: String,
  transaction_type: {
    type: String,
    enum: ['wallet', 'keloWallet']
  },
  date: String
});

module.exports = mongoose.model("Transaction", TransactionSchema);
