const Cashbook = require("../models/cashBookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get All Cashbooks
exports.getAllCashbooks = catchAsync(async (req, res) => {
  const cashbooks = await Cashbook.find();

  res.status(200).json({
    status: "success",
    message: "cashbooks get successfully",
    results: cashbooks.length,
    data: {
      cashbook: cashbooks,
    },
  });
});

//Create Cashbook
exports.createCashbook = catchAsync(async (req, res, next) => {
  const newCashbook = await Cashbook.create(req.body);
  res.status(201).json({
    status: "success",
    message: "cashbook created successfully",
    data: {
      cashbook: newCashbook,
    },
  });
});

//Delete Cashbook
exports.deleteCashbook = catchAsync(async (req, res, next) => {
  const cashbook = await Cashbook.findByIdAndDelete(req.params.id);

  if (!cashbook) {
    return next(new AppError("No cashbook found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "cashbook deleted successfully",
    data: null,
  });
});
