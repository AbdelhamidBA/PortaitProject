const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;


var UserSchema = new Schema({
    user_fullname: {
        type: String,
        required: true
    },
    user_birthday: {
        type: String,
        required: true
    },
    user_phone: {
        type: String,
        required: true
    },
    user_address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, { collection: 'Users' });

UserSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        user_fullname: Joi.string().trim().max(40).required(),
        user_birthday: Joi.string().trim().required(),
        user_phone: Joi.string().trim().min(8).max(8).required(),
        user_address: Joi.string().trim().min(3).max(15).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(8).max(15).required(),
        role: Joi.string().trim().required()
    });
    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Users', UserSchema);