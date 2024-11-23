const mongoose = require("mongoose");

const StockModelSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  quantity: {
    type: String,
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
StockModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Stock = mongoose.model("Stock", StockModelSchema);

module.exports = Stock;
