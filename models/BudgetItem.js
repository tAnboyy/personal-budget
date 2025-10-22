const mongoose = require('mongoose');

const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;

const BudgetItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  color: { type: String, required: true, match: hexColorRegex }
});

module.exports = mongoose.model('BudgetItem', BudgetItemSchema);
