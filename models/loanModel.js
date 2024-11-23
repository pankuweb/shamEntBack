const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    totalBillAmount: {
      type: Number,
    },
    downPayment: {
      type: Number,
      default: 0,
    },
    loanAmount: {
      type: Number,
    },
    gaurenterName: {
      type: String,
    },
    gaurenterMobileNo: {
      type: String,
    },
    pendingPayment: {
      type: Number,
    },
    termInMonth: {
      type: Number,
    },
    interest: {
      type: Number,
      default: 0,
    },
    monthlyInstallment: {
      type: Number,
    },
    billNo: {
      type: Number,
    },
    loanNo: {
      type: Number,
    },
    qty: {
      type: Number,
    },
    verifiedBy: {
      type: String,
    },
    customer: {
      type: String,
    },
    details: {
      type: String,
    },
    installmentsDate: {
      type: Array,
    },
    installments: [
      {
        title: { type: String },
        amount: { type: Number },
        date: { type: String },
      },
    ],

    fileCharges: {
      type: Number,
    },
    read: {
      type: String,
      default: false,
    },
    completed: {
      type: String,
      default: false,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "customer must belong to a customer"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

loanSchema.index({ customer: 1 }, { unique: false });

loanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: [
      "firstName",
      "lastName",
      "relativeFirstName",
      "relativeLastName",
      "email",
      "mobile",
      "gender",
      "adharNo",
      "permanentAddress",
      "photo",
    ],
  });
  next();
});

loanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
