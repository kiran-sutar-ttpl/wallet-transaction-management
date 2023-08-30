const User = require('../../models/user')
const Wallet = require('../../models/wallet')
const keloWallet = require('../../models/keloWallet')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registrationSchema, loginSchema } = require('../../helper/validation_schemas')

exports.register = async(req, res) => {
    try {
        const result = await registrationSchema.validate(req.body);
        console.log("🚀 ~ file: authController.js:10 ~ exports.register=async ~ result:", result.value)
        if(result.error) {
            return res.status(422).json({
                success: false,
                error: result.error.details[0].message,
            });
        }

        const userExist = await User.find({
            $or: [
                { username: result.value.username },
                { email: result.value.email }
            ]
        })

        if(userExist.length > 0) {
            return res.status(422).json({
                success: false,
                error: "Username or email already exists",
            });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userObject = new User({
            username: result.value.username,
            email: result.value.email,
            first_name: result.value.firstName,
            last_name: result.value.lastName,
            password: hashedPassword
        })

        userObject.save().then(async function (user) {
            console.log('user>>>', user);
            const walletObject = new Wallet({
                balance: 0,
                user_id: user._id
            })
            await walletObject.save()

            const keloWalletObject = new keloWallet({
                balance: 0,
                user_id: user._id
            })
            await keloWalletObject.save()

            return res.status(201).json({
                message: "User registration success"
            })
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).json({
                message: "Something went wrong while creating user.",
                success: false,
                error: err.message
            });
        });
    } catch(error) {
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error: error.message
        });
    }
}

exports.login = async(req, res) => {
    try {
        const result = await loginSchema.validateAsync(req.body);

        const userData = await User.findOne({ email: result.email });

        if (!userData) {
            return res.status(401).json({
                message: "User doesnot exist.",
                success: false
            });
        }

        if (await bcrypt.compare(result.password, userData.password)) {
            const user = {
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                username: userData.username
            };

            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10d' });

            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

            return res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user
            });
        } else {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }
    } catch (error) {
        console.log(error);
        if (error.isJoi === true) {
            return res.status(422).json({
                error: error.details,
            });
        }
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error
        });
    }
}

exports.logout = async(req, res) => {
    try {
        console.log('In logout');
        const authHeader = req.headers['authorization'].split(' ')[1]

        jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
            if (logout) {
                return res.status(200).json({
                    message: "Logout success",
                    success: true
                });
            } else  {
                return res.status(500).json({
                    message: "Something went wrong! Please try again later.",
                    success: false,
                    err
                });
            }
        });

    } catch (error) {
        console.log(error);
        if (error.isJoi === true) {
            return res.status(422).json({
                error: error.details,
            });
        }
        return res.status(500).json({
            message: "Something went wrong! Please try again later.",
            success: false,
            error
        });
    }
}