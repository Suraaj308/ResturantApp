const Chef = require('../models/chefs');

exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    console.log('Chefs found:', chefs);
    res.status(200).json(chefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ message: 'Error fetching chefs', error: error.message });
  }
};
