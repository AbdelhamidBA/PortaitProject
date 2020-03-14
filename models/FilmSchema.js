const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const FilmSchema = new Schema({
    film_name: { type: String, unique: true, required: true },
    film_cover: { type: String, required: true },
    film_description: { type: String, required: true },
    film_gender: { type: String, required: true },
    film_show_date: { type: Date, required: true },
    film_duration: { type: String, required: true }
}, { collection: 'Films' });

FilmSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        film_name: Joi.string().trim().required(),
        film_cover: Joi.string().trim().required(),
        film_description: Joi.string().trim().required(),
        film_gender: Joi.string().trim().required(),
        film_show_date: Joi.date().required(),
        film_duration: Joi.string().trim().required()
    });

    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Films', FilmSchema);