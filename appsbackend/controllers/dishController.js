const Dish = require('../models/dishes');

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    console.log('Dishes found:', dishes);
    res.status(200).json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
};