const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });
    
    return schema.validate(data);
}

module.exports = { registerValidation };
