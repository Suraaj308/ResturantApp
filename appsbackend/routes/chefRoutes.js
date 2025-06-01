const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');

router.get('/', chefController.getAllChefs);

module.exports = router;
