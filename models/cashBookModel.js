const mongoose = require("mongoose");

const CashBookSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
CashBookSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CashBook = mongoose.model("CashBook", CashBookSchema);

module.exports = CashBook;
