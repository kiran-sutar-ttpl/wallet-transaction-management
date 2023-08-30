const mongoose = require("mongoose");

var WalletSchema = new mongoose.Schema({
    user_id: String,
    balance: Number
});

module.exports = mongoose.model("Wallet", WalletSchema);
