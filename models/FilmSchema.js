const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Tickets = require('./TicketSchema');

const FilmSchema = new Schema({
    film_name: { type: String, unique: true, required: true },
    film_cover: { type: Buffer, required: true },
    film_cover_type: { type: String, required: true },
    film_description: { type: String, required: true },
    film_gender: { type: String, required: true },
    film_show_date: { type: Date, required: true },
    film_duration: { type: String, required: true }
}, { collection: 'Films' });

FilmSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        film_name: Joi.string().trim().required(),
        film_cover: Joi.required(),
        film_cover_type: Joi.string().required(),
        film_description: Joi.string().trim().required(),
        film_gender: Joi.string().trim().required(),
        film_show_date: Joi.date().required(),
        film_duration: Joi.string().trim().required()
    });

    return Joi.validate(obj, validSchema);
};

FilmSchema.virtual('coverImagePath').get(function() {
    if (this.film_cover != null && this.film_cover_type != null) {
        return `data:${this.film_cover_type};charset=utf-8;base64,${this.film_cover.toString('base64')}`;
    }
});

FilmSchema.pre('remove', function(next) {
    let soldticket = 0;
    Tickets.find({ id_Film: this.id }, (err, result) => {
        if (err) {
            next(err);
        } else if (result.length > 0) {
            result.forEach(function(ticket) {
                if (ticket.sold !== 0) {
                    soldticket += 1;
                }
            });
            if (soldticket !== 0) {
                next(new Error('Failed to Delete: This Film has sold tickets'));
            }
        } else {
            next();
        }
    });
});

FilmSchema.post('remove', function(next) {
    Tickets.remove({ id_Film: this.id }, function(err) {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
});




module.exports = mongoose.model('Films', FilmSchema);