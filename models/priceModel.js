const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    childPrice: {
      type: Number,
    },
    mobilePrice: {
      type: Number,
    },
    driverPrice: {
      type: Number,
    },
  },
  { versionKey: false }
);

const price = mongoose.model("price", priceSchema);

module.exports = price;
