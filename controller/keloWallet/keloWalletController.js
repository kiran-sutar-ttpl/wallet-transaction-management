const Transaction = require('../../models/transaction')
const Wallet = require('../../models/keloWallet')
const User = require('../../models/user')
const { createTransactionSchema } = require('../../helper/validation_schemas')
const moment = require('moment')

exports.getTransactionList = async (req, res) => {
    try {
        Transaction.find({ $and: [
            { from_user_id: req.user.id }, 
            { transaction_type: 'keloWallet' }
        ]})
        .then(function (transactions) {
            console.log(transactions);
            return res.status(200).json({
                transactions
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
    } catch (error) {
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

exports.createTransaction = async (req, res) => {                            
    try {
        const result = await createTransactionSchema.validate(req.body);
        if(result.error) {
            return res.status(422).json({
                success: false,
                error: result.error.details[0].message,
            });
        }

        const senderWalletDetails = await Wallet.findOne({ user_id: req.user.id })
        const receiverUserDetails = await User.findOne({ username: result.value.username })
        if(!receiverUserDetails) {
            return res.status(200).json({
                message: "Receiver not found",
                success: false,
            });
        }
        const receiverWalletDetails = await Wallet.findOne({ user_id: receiverUserDetails.id })
    
        if(senderWalletDetails.balance < result.value.amount) {
            return res.status(200).json({
                message: "Insufficicent balance!",
                success: false,
            });
        }

        await Wallet.updateOne( { user_id: req.user.id }, { balance: (senderWalletDetails.balance-result.value.amount) } )
        await Wallet.updateOne( { user_id: receiverWalletDetails.user_id }, { balance: (receiverWalletDetails.balance+result.value.amount) })

        await Transaction.create([
            {
                from_user_id: req.user.id,
                to_user_id: receiverWalletDetails.user_id,
                amount: result.value.amount,
                status: 'Success',
                transaction_type: 'keloWallet',
                date: moment().format()
            }
        ])

        return res.status(200).json({
            success: true,
            message: "Transaction success!"
        });
    } catch (error) {
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

exports.getTransaction = async (req, res) => {
    try {
        console.log('params>',req.params);
        if(!req.params.transactionId) {
            return res.status(200).json({
                message: "Please pass transaction id in params"
            });
        }
        const trans = await Transaction.findOne({ _id: req.params.transactionId })
        
        if(!trans) {
            return res.status(200).json({
                message: "No transaction found with the given id"
            });
        }

        return res.status(200).json({
            trans
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error: error.message
        });
    }
}