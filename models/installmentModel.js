const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
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
installmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Installment = mongoose.model("Installment", installmentSchema);

module.exports = Installment;
