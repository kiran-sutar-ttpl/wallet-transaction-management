const mongoose = require("mongoose");

var KeloWalletSchema = new mongoose.Schema({
    user_id: String,
    balance: Number
});

module.exports = mongoose.model("Kelo_Wallet", KeloWalletSchema);
