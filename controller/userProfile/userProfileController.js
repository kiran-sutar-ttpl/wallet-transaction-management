const User = require('../../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registrationSchema = require('../../helper/validation_schemas')
const { authenticateToken } = require('../../middleware/authMiddleware')

exports.getUserProfile = async(req, res) => {
    try {
        console.log("User>>", req.user);

        return res.status(200).json({
            user: req.user
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

exports.updateUserProfile = async(req, res) => {
    try {
        console.log("User>>", req.user);
        const dataToUpdate = {
            username: req.body.username,
            email: req.body.email,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
        }
        User.updateOne({ _id: req.user.id }, dataToUpdate)
        .then(function (user) {
            console.log(user);
            return res.status(200).json({
                message: "User updated successfully"
            })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong while updating user.",
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