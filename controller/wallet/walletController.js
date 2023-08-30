const Wallet = require("../../models/wallet");

exports.getWalletDetails = async (req, res) => {
    try {
        Wallet.findOne({ user_id: req.user.id })
        .then(function (wallet) {
            console.log(wallet);
            return res.status(200).json({
                wallet
            });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong while getting wallet details.",
                success: false,
                error: err.message
            });
        });
    } catch(error) {
        if (error.isJoi === true) {
            return res.status(422).json({
                success: false,
                error: error.details,
            });
        }
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error: error.message
        });
    }
}

exports.updateWalletDetails = async (req, res) => {
    console.log("🚀 ~ file: walletController.js:4 ~ exports.getWalletDetails ~ req:", req.user)
    try {
        console.log("User>>", req.user);
        const dataToUpdate = {
            balance: req.body.balance
        }
        Wallet.updateOne({ user_id: req.user.id }, dataToUpdate)
        .then(function (wallet) {
            console.log(wallet);
            return res.status(200).json({
                message: "Wallet details updated successfully",
                wallet
            })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong while updating wallet details.",
                success: false,
                error: err.message
            });
        });
    } catch(error) {
        if (error.isJoi === true) {
            return res.status(422).json({
                success: false,
                error: error.details,
            });
        }
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error: error.message
        });
    }
}
