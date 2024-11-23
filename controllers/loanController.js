const Loan = require("../models/loanModel");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
var moment = require("moment");
const {
  addLoanValidation,
  updateLoanValidation,
} = require("./../utils/validations/loanValidation");

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
//Upload image
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadLoanPhoto = upload.single("photo");

//Resizing Image
exports.resizeLoanPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `loan-profile-${Date.now()}.jpeg`;
  const filePath = "public/img/loans";

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${filePath}/${fileName}`);

  req.body.photo = `http://localhost:${process.env.PORT}/img/loans/${fileName}`;
  next();
});

//Routeloanhanddlers

//Get All Loans
exports.getAllLoans = catchAsync(async (req, res) => {
  // let query = {};
  // if (req.query["search"]) {
  //   query.customer = { $regex: req.query["search"] };
  // } else if (req.query["completed"]) {
  //   query.completed = { $regex: req.query["completed"] };
  // }
  // const loans = new APIFeatures(Loan.find(), query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  // const filteredLoans = await loans.query;
  //
  const test = await Loan.find();
  const filteredLoans = test.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });

  res.status(200).json({
    status: "success",
    message: "loans get successfully",
    results: filteredLoans.length,
    data: {
      loan: filteredLoans,
    },
  });
});

//Get comming Loans
exports.getComingLoans = catchAsync(async (req, res, next) => {
  let query = { installmentsDate: { gte: new Date() } };

  const trendLoans = new APIFeatures(Loan.find(), query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const loans = await trendLoans.query;

  res.status(200).json({
    status: "success",
    message: "Loans fetched successfully",
    results: loans.length,
    data: {
      loans,
    },
  });
});

//Get Current day's Loans
exports.getTodaysLoans = catchAsync(async (req, res, next) => {
  const startDate = formatDate(new Date());
  const endDate = new Date(
    new Date().setUTCHours(23, 59, 59, 999)
  ).toISOString();

  let allLoans = await Loan.find();
  // const result = allLoans.flatMap((el) => {
  //   return el.installmentsDate.filter((date) => date == startDate);
  // });

  var result = allLoans.filter((element) =>
    element.installmentsDate.some((subElement) => subElement == startDate)
  );

  res.status(200).json({
    length: result.length,
    status: "success",
    message: "Loans fetched successfully",
    data: {
      result,
    },
  });
});

//Get Loans using filter
exports.getFilteredLoans = catchAsync(async (req, res, next) => {
  const data = req.query["date"];

  let result = await Loan.find({ "installments.date": data });

  res.status(200).json({
    length: result.length,
    status: "success",
    message: "Loans fetched successfully",
    data: {
      result,
    },
  });
});

//Get Current day's Loans
// exports.getFilteredLoans = catchAsync(async (req, res, next) => {
//   const startDate = req.query["date"];

//   let allLoans = await Loan.find();
//   // const result = allLoans.flatMap((el) => {
//   //   return el.installmentsDate.filter((date) => date == startDate);
//   // });

//   var result = allLoans.filter((element) =>
//     element.installmentsDate.some((subElement) => subElement == startDate)
//   );

//   res.status(200).json({
//     length: result.length,
//     status: "success",
//     message: "Loans fetched successfully",
//     data: {
//       result,
//     },
//   });
// });
//Get Loans using filter of overdue
// exports.getOverdueLoans = catchAsync(async (req, res, next) => {
//Get Loans using filter
exports.getOverdueLoans = catchAsync(async (req, res, next) => {
  const date = req.query["date"];
  const completedStatus = req.query["completed"];

  let oldResult = await Loan.find({
    $and: [
      {
        installmentsDate: date,
      },
      { completed: completedStatus },
    ],
  });
  const loans = await Loan.find();
  var a = loans.filter((element) =>
    element.installmentsDate.some((subElement) => subElement <= date)
  );
  var b = a.filter((element) => {
    element.installmentsDate = element.installmentsDate.filter(
      (item) => item <= date
    );

    return element;
  });
  const x = b.map((item) => {
    const totalOfIns = item.installments.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    );
    item.ins = totalOfIns;
    item.datewisetotal =
      item.monthlyInstallment * (item.installmentsDate.length + 1);
    return item;
  });

  const z = b.filter((item) => {
    const totalOfIns = item.installments.reduce(
      (accumulator, current) => accumulator + current.amount,
      0
    );
    item.ins = totalOfIns;
    item.datewisetotal = item.monthlyInstallment * item.installmentsDate.length;

    return item.ins < item.datewisetotal && item.completed != "true";
  });

  const result = z.filter((item) => item.ins < item.datewisetotal);
  // const pendingLoan = loans.filter(
  //   (item) => item.installments.length == item.installmentsDate.length
  // );
  // const pendingLoanData = pendingLoan.filter(
  //   (item) => item.completed != "true" && item.installmentsDate[0] < date
  // );
  // const result = [...c, ...pendingLoanData];
  res.status(200).json({
    length: result.length,
    status: "success",
    message: "Loans fetched successfully",
    data: {
      result,
    },
  });
});
// exports.getOverdueLoans = catchAsync(async (req, res, next) => {
//   const date = req.query["date"];
//   const completedStatus = req.query["completed"];

//   let result = await Loan.find({
//     $and: [
//       {
//         installmentsDate: date,
//       },
//       { completed: completedStatus },
//     ],
//   });
//   const loans = await Loan.find();
//   const pendingLoan = loans.filter(
//     (item) => item.installments.length == item.installmentsDate.length
//   );
//   const pendingLoanData = pendingLoan.filter(
//     (item) => item.completed != "true" && item.installmentsDate[0] < date
//   );
//   res.status(200).json({
//     length: result.length,
//     status: "success",
//     message: "Loans fetched successfully",
//     data: {
//       result,
//       pendingLoanData,
//     },
//   });
// });
//Get Loans By ID
exports.getLoan = catchAsync(async (req, res, next) => {
  const loanIdArr = req.params.id.split(",");
  const loan = await Loan.find({ _id: loanIdArr });

  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "loan fetch successfully",
    data: {
      loan,
    },
  });
});

//Create Loan
exports.createLoan = catchAsync(async (req, res, next) => {
  const body = req.body;
  const { error } = addLoanValidation(body);
  if (error) return next(new AppError(error.details[0].message, 400));

  installmentsDates = [];
  var date = new Date(req.body.installmentsDate);

  const format = "YYYY-MM-DD";

  // add a day
  d = date.getDate();
  m = date.getMonth();
  y = date.getFullYear();

  for (i = 0; i < req.body.termInMonth; i++) {
    var curdate = new Date(y, m + i, d);
    installmentsDates.push(moment(curdate).format(format));
  }

  //calculating bill&loan counts
  const loan = await Loan.find();
  req.body.billNo = Number(loan[loan.length - 1].billNo) + 1;
  req.body.loanNo = Number(loan[loan.length - 1].loanNo) + 1;

  // adding additional fields
  const totalInt = (req.body.loanAmount / 100) * req.body.interest;

  req.body.pendingPayment = Number(req.body.loanAmount) + Number(totalInt);
  req.body.installmentsDate = installmentsDates;

  const newLoan = await Loan.create(req.body);
  if (!req.body.customer) req.body.customer = req.customer.id;
  res.status(201).json({
    status: "success",
    message: "loan created successfully",
    data: {
      loan: newLoan,
    },
  });
});

//Update Loan
exports.updateLoan = catchAsync(async (req, res, next) => {
  console.log(req.body, "allLoans");

  const body = req.body;

  const loan = await Loan.findById(req.params.id);
  const installments = loan.installments;
  //Date
  installmentsDates = [];
  var date = new Date(req.body.installmentsDate);

  const format = "YYYY-MM-DD";

  // add a day
  d = date.getDate();
  m = date.getMonth();
  y = date.getFullYear();

  for (i = 0; i < req.body.termInMonth; i++) {
    var curdate = new Date(y, m + i, d);
    installmentsDates.push(moment(curdate).format(format));
  }
  //
  const totalInt = (req.body.loanAmount / 100) * req.body.interest;

  req.body.pendingPayment = Number(req.body.loanAmount) + Number(totalInt);
  req.body.installmentsDate = installmentsDates;

  const updates = Object.keys(req.body);
  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }
  updates.forEach((update) => (loan[update] = req.body[update]));

  loan.installments = installments;
  await loan.save();

  res.status(200).json({
    status: "success",
    message: "loan updated successfully",
    data: {
      loan,
    },
  });
});

//reopenLoan Loan
exports.reopenLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id);
  req.body.completed = false;

  const updates = Object.keys(req.body);
  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }
  updates.forEach((update) => (loan[update] = req.body[update]));

  await loan.save();

  res.status(200).json({
    status: "success",
    message: "loan reopened successfully",
    data: {
      loan,
    },
  });
});

//Delete Loan
exports.deleteLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.findByIdAndDelete(req.params.id);

  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "loan deleted successfully",
    data: null,
  });
});

//Notifications
exports.getNotifications = catchAsync(async (req, res, next) => {
  const date = req.query["date"];
  const completedStatus = req.query["read"];

  const startDate = date
    ? new Date(new Date(date).setUTCHours(0, 0, 0, 0)).toISOString()
    : "";
  const endDate = date
    ? new Date(new Date(date).setUTCHours(23, 59, 59, 999)).toISOString()
    : "";
  let multiSectedData = "";
  if (date !== undefined && completedStatus !== undefined) {
    //1) if completed and date is selected
    multiSectedData = {
      $and: [
        {
          installmentsDate: {
            $gte: `${startDate}`,
            $lt: `${endDate}`,
          },
        },
        { read: completedStatus },
      ],
    };
  }

  let result = await Loan.find(multiSectedData);
  res.status(200).json({
    length: result.length,
    status: "success",
    message: "Loans fetched successfully",
    data: {
      result,
    },
  });
});

//Get Loans between two dates
exports.getLoansBetweenTwoDates = catchAsync(async (req, res, next) => {
  const start = req.query["start"];
  const end = req.query["end"];
  const startDate = new Date(
    new Date(start).setUTCHours(0, 0, 0, 0)
  ).toISOString();
  const endDate = new Date(
    new Date(end).setUTCHours(23, 59, 59, 999)
  ).toISOString();
  console.log(startDate, endDate);
  let result = await Loan.find({
    installmentsDate: {
      $gte: `${startDate}`,
      $lt: `${endDate}`,
    },
  });

  res.status(200).json({
    length: result.length,
    status: "success",
    message: "Loans fetched successfully",
    data: {
      result,
    },
  });
});

//Close Loan
exports.CloseLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id);
  req.body.completed = true;

  const updates = Object.keys(req.body);
  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }
  updates.forEach((update) => (loan[update] = req.body[update]));

  await loan.save();

  res.status(200).json({
    status: "success",
    message: "loan closed successfully",
    data: {
      loan,
    },
  });
});
