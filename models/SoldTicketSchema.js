const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const SoldTicketSchema = new Schema({
    id_ticket: { type: Schema.Types.ObjectId, ref: 'Tickets', required: true },
    id_user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    date_sold: { type: Date, required: true }
}, { collection: 'SoldTickets' });

SoldTicketSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        id_ticket: Joi.string().alphanum().required(),
        id_user: Joi.string().alphanum().required(),
        date_sold: Joi.date().trim().required()
    });

    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('SoldTickets', SoldTicketSchema);