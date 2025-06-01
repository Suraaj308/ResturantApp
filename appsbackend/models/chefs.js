const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    chefName: { type: String, required: true },
    numberOfOrders: { type: Number, default: 0 },
    cookingTime: { type: Number, default: 0 },
});

module.exports = mongoose.model('Chef', chefSchema, 'chefs');