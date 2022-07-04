const mongoose = require('mongoose');
const Review = require('./review');
const Dish = require('./dishes');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    price: Number,
    numOfItem: Number,
    dishes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Order', OrderSchema);