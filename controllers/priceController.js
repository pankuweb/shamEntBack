const catchAsync = require("../utils/catchAsync");
const Price = require("../models/priceModel");
// const io = require("../server");

// -----------------
//Route handdlers
// -----------------

// Get all contacts of enquiery
// -----------------------
exports.getAllPrice = catchAsync(async (req, res) => {
  const prices = await Price.find().sort({ $natural: -1 });

  res.status(200).json({
    message: "success",
    message: "Price fetched successfully!",
    data: {
      prices: prices[0],
    },
  });
});

// Create a enquiery contact
// -----------------------
exports.createPrice = catchAsync(async (req, res, next) => {
  await Price.create(req.body);
  const price = await Price.find().sort({ $natural: -1 });

  res.status(201).json({
    status: "success",
    message: "created successfully!",
    data: {
      price: price,
    },
  });
});

exports.updatePrice = catchAsync(async (req, res, next) => {
  const price = await Price.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!price) {
    return next(new AppError("No price found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "updated successfully",
    data: {
      price,
    },
  });
});
