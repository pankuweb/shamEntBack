const Stock = require("../models/StockModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get All Stocks
exports.getAllStocks = catchAsync(async (req, res) => {
  const stocks = await Stock.find();

  res.status(200).json({
    status: "success",
    message: "stocks get successfully",
    results: stocks.length,
    data: {
      stock: stocks,
    },
  });
});

//Create Stock
exports.createStock = catchAsync(async (req, res, next) => {
  const newStock = await Stock.create(req.body);
  res.status(201).json({
    status: "success",
    message: "stock created successfully",
    data: {
      stock: newStock,
    },
  });
});

//Delete Stock
exports.deleteStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);

  if (!stock) {
    return next(new AppError("No stock found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "stock deleted successfully",
    data: null,
  });
});


exports.updateStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!stock) {
    return next(new AppError("No stock found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "updated successfully",
    data: {
      stock,
    },
  });
});

exports.getStock = catchAsync(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    return next(new AppError("No data found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: `Data fetched successfully`,
    data: {
      stock,
    },
  });
});