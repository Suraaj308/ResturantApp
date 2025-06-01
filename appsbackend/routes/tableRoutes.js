const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/', tableController.getAllTables);
router.delete('/:id', tableController.deleteTable);
router.post('/', tableController.createTable);

module.exports = router;