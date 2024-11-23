const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  customerName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
  },
  mobile: {
    type: String,
  },
  item: [
    {
      itemName: { type: String },
      qty: { type: String },
      salePrice: { type: String },
      Total: { type: String },
    },
  ],
  total: {
    type: String,
  },
  discount: {
    type: String,
  },
  afterDiscount: {
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
BillSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Bill = mongoose.model("Bill", BillSchema);

module.exports = Bill;
