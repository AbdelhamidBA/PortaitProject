const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;


var FilmReviewSchema = new Schema({
    id_film: {
        type: Schema.Types.ObjectId,
        ref: 'Films',
        required: true
    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    review: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
}, { collection: 'Film_Review' });

FilmReviewSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        id_film: Joi.string().trim().required(),
        id_user: Joi.string().trim().required(),
        review: Joi.string().trim().required(),
        feedback: Joi.string().trim().required()
    });
    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Film_Review', FilmReviewSchema);