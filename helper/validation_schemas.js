const Joi = require('@hapi/joi').extend(require('@joi/date'));

const registrationSchema = Joi.object({
    username: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const createTransactionSchema = Joi.object({
    username: Joi.string().min(1).max(50).required(),
    amount: Joi.number().greater(0).required(),
})

module.exports = {
    registrationSchema,
    loginSchema,
    createTransactionSchema
}