const mongoose = require('mongoose');

const dishOrderedSchema = new mongoose.Schema({
    dishId: { type: mongoose.Schema.Types.ObjectId, required: true },
    dishName: { type: String, required: true },
    dishCategory: { type: String, required: true },
    dishPrice: { type: Number, required: true },
    dishPrepTime: { type: Number, required: true },
    dishQuantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerMobileNumber: { type: String, required: true },
    dishOrdered: { type: [dishOrderedSchema], required: true },
    orderType: { type: String, enum: ['DineIn', 'TakeAway'], required: true },
    customerAddress: { type: String, default: null },
    customerCount: { type: Number, default: null },
    orderPrice: { type: Number, required: true },
    orderPrepTime: { type: Number, required: true },
    orderCookingInstructions: { type: String, default: '' },
    tableName: { type: String, default: null },
    chairCount: { type: Number, default: null },
    orderNumber: { type: Number, required: true },
    chefName: { type: String, required: true },
    orderedTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
