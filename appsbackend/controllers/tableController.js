const Table = require('../models/tables');
const mongoose = require('mongoose');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().select('-__v');
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tables',
      error: error.message
    });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const tableId = req.params.id;

    if (!mongoose.isValidObjectId(tableId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid table ID format'
      });
    }

    const table = await Table.findByIdAndDelete(tableId);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Table deleted successfully',
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting table',
      error: error.message
    });
  }
};

exports.createTable = async (req, res) => {
  try {
    const { tableName, chairCount } = req.body;

    if (!tableName || !chairCount) {
      return res.status(400).json({
        success: false,
        message: 'tableName and chairCount are required',
      });
    }

    const newTable = new Table({
      tableName,
      chairCount
    });

    const savedTable = await newTable.save();

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: savedTable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating table',
      error: error.message
    });
  }
};
