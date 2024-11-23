const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const AWS = require("aws-sdk");
const { uuid } = require("uuidv4");
const multer = require("multer");
const sharp = require("sharp");
const {
  updateUserValidation,
  createUserValidation,
} = require("./../utils/validations/userValidation");
//Upload image
const multerStorage = multer.memoryStorage();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});
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

exports.uploadUserPhoto = upload.single("photo");

//Routeuserhanddlers
//1
exports.uploadPhoto = catchAsync(async (req, res, next) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(data);
  });
});

//Resizing Image
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `user-profile-${Date.now()}.jpeg`;
  const filePath = "public/img/users";
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${filePath}/${fileName}`);

  req.body.photo = `${process.env.BASE_URL}/img/users/${fileName}`;
  next();
});

//Routeuserhanddlers
//1
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    results: users.length,
    data: {
      user: users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: `${user.userType} fetched successfully`,
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  //Validate Data
  const { error } = createUserValidation(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const filteredBody = filterObj(req.body);
  if (req.file) filteredBody.photo = req.file.filename;

  let userData = { ...filteredBody, ...req.body };
  const newUser = await User.create(userData);

  res.status(201).json({
    status: "success",
    message: `Customer created successfully`,
    data: newUser,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  //Validate Data
  const { error } = updateUserValidation(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  const filteredBody = filterObj(req.body);
  if (req.file) filteredBody.photo = req.file.filename;

  let userData = { ...filteredBody, ...req.body };
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  const updates = Object.keys(userData);
  updates.forEach((update) => (user[update] = userData[update]));
  await user.save();

  res.status(200).json({
    status: "success",
    message: `Customer updated successfully`,
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Users deleted successfully",
    data: null,
  });
});
