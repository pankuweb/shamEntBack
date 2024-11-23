const Installment = require("./../models/installmentModel");
const Loan = require("../models/loanModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const {
  addInstallmentValidation,
  updateInstallmentValidation,
} = require("./../utils/validations/installmentValidation");
const {
  addLoanValidation,
  updateLoanValidation,
} = require("./../utils/validations/loanValidation");

//Routeinstallmenthanddlers

//Get All Installments
exports.getAllInstallments = catchAsync(async (req, res) => {
  const installments = await Installment.find();

  res.status(200).json({
    status: "success",
    message: "All installments fetch successfully",
    results: installments.length,
    data: {
      installment: installments,
    },
  });
});

//Get Installment by id
exports.getInstallment = catchAsync(async (req, res, next) => {
  const installment = await Installment.findById(req.params.id);

  if (!installment) {
    return next(new AppError("No installment found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "get installment successfully",
    data: {
      installment,
    },
  });
});

//Create Installment
exports.createInstallment = catchAsync(async (req, res, next) => {
  const { error } = addInstallmentValidation(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const loan = await Loan.findById(req.params.id);
  const interest = (loan.loanAmount / 100) * loan.interest;
  const loanWithInt = loan.loanAmount + interest;
  loan.pendingPayment =
    loanWithInt -
    (loan.installments.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    ) +
      Number(req.body.amount));

  loan.completed =
    loan.pendingPayment == 0 || loan.pendingPayment < 0 ? true : false;
  loan.installments.push(req.body);
  await loan.save();
  res.status(201).json({
    status: "success",
    message: "installment created successfully",
    data: {
      installment: req.body,
    },
  });
});

//Update Installment
exports.updateInstallment = catchAsync(async (req, res, next) => {
  const { error } = addInstallmentValidation(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  // const loan = await Loan.findById(req.params.id);
  // let completeArr = loan.installments;
  // const interest = (loan.loanAmount / 100) * loan.interest;
  // const loanWithInt = loan.loanAmount + interest;
  // const lessableamount = loan.installments.filter(
  //   (item) => item.title == req.body.title
  // )[0].amount;
  // const total = (loan.loanAmount / 100) * loan.interest;

  // completeArr = completeArr.map((u) =>
  //   u.title !== req.body.title ? u : req.body
  // );
  // let Installments = completeArr.reduce(
  //   (accumulator, current) => accumulator + Number(current.amount),
  //   0
  // );
  // if (req.body.amount > loan.installments[Number(req.body.insId)]) {
  // }
  // const pendingAmount = loan.loanAmount + total - Installments;
  // loan.pendingPayment = pendingAmount;

  // loan.completed = pendingAmount == 0 || pendingAmount < 0 ? true : false;

  // loan.installments = completeArr;
  const loan = await Loan.findById(req.params.id);
  loan.installments.map((item) => (item._id = `ObjectId(${req.body._id})`));

  const UserAdd = loan.installments.filter(
    (item) => item._id != req.body.insId
  );
  console.log(loan.pendingPayment, "loan.vbbbb");

  const newIns = {
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    _id: req.body.insId,
  };
  UserAdd.push(newIns);
  loan.installments = UserAdd;
  const interest = (loan.loanAmount / 100) * loan.interest;
  const loanWithInt = loan.loanAmount + interest;

  loan.pendingPayment =
    loanWithInt -
    loan.installments.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    );
  loan.completed =
    loan.pendingPayment == 0 || loan.pendingPayment < 0 ? true : false;
  console.log(loan.pendingPayment, "loan.pendingPaymentaaaa");
  await loan.save();
  res.status(200).json({
    status: "success",
    message: "installment updated successfully",
    data: {
      installment: req.body,
    },
  });
});

//Delete Installment
exports.deleteInstallment = catchAsync(async (req, res, next) => {
  // const { error } = addInstallmentValidation(req.body);
  // if (error) return next(new AppError(error.details[0].message, 400));

  const loan = await Loan.findById(req.params.id);
  loan.installments.map((item) => (item._id = `ObjectId(${req.body.id})`));

  const AfterRemoveIns = loan.installments.filter(
    (item) => item._id != req.body.id
  );
  loan.installments = AfterRemoveIns;

  const interest = (loan.loanAmount / 100) * loan.interest;
  const loanWithInt = loan.loanAmount + interest;

  loan.pendingPayment =
    loanWithInt -
    loan.installments.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    );
  loan.completed =
    loan.pendingPayment == 0 || loan.pendingPayment < 0 ? true : false;

  await loan.save();
  res.status(200).json({
    status: "success",
    message: "installment deleted succesfully",
    data: null,
  });
});
