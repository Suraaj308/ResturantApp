// models/tables.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  chairCount: { type: Number, required: true },
  tableStatus: { type: String, enum: ['A', 'X'], default: 'A' },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema, 'tables');