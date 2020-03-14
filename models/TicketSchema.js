const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Float = require('mongoose-float').loadType(mongoose);
const DecimalExtension = require('joi-decimal');
const Joi = require('joi').extend(DecimalExtension);


const TicketSchema = new Schema({
    id_Film: { type: Schema.Types.ObjectId, ref: 'Films', required: true },
    seat: { type: Number, required: true },
    price: { type: Float, required: true },
    sold: { type: Number, required: true },
    show_room: { type: Number, required: true },
}, { collection: 'Tickets' });

TicketSchema.methods.validSchemaForm = (obj) => {
    let validSchema = Joi.object().keys({
        id_Film: Joi.string().alphanum().required(),
        seat: Joi.number().required(),
        price: Joi.decimal().required(),
        sold: Joi.number().max(1).required(),
        show_room: Joi.number().required()
    });

    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Tickets', TicketSchema);