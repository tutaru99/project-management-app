const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        usernname: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });
    
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(6).max(255).required()
    });
    
    return schema.validate(data);
}

module.exports = { registerValidation, loginValidation };
