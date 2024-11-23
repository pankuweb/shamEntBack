const Bill = require("../models/billModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get All Bills
exports.getAllBills = catchAsync(async (req, res) => {
  const bills = await Bill.find();

  res.status(200).json({
    status: "success",
    message: "bills get successfully",
    results: bills.length,
    data: {
      bill: bills,
    },
  });
});

//Create Bill
exports.createBill = catchAsync(async (req, res, next) => {
  const newBill = await Bill.create(req.body);
  res.status(201).json({
    status: "success",
    message: "bill created successfully",
    data: {
      bill: newBill,
    },
  });
});

//Delete Bill
exports.deleteBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findByIdAndDelete(req.params.id);

  if (!bill) {
    return next(new AppError("No bill found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "bill deleted successfully",
    data: null,
  });
});
