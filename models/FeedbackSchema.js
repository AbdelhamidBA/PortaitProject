const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
}, { collection: 'Feedbacks' });

FeedbackSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        id_user: Joi.string().alphanum().trim().required(),
        subject: Joi.string().trim().required(),
        feedback: Joi.string().trim().required()
    });

    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Feedbacks', FeedbackSchema);