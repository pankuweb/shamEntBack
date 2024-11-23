const mongoose = require("mongoose");

const BookModelSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  pending: {
    type: Number,
    default: 0,
  },
  customer: {
    type: String,
  },
  mobile: {
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
BookModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Book = mongoose.model("Book", BookModelSchema);

module.exports = Book;
