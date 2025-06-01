const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  dishPrice: { type: Number, required: true },
  dishPrepTime: { type: Number, required: true },
  dishCategory: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Dish', dishSchema, 'dishes');