const Joi = require("joi");

//Loan Validation
const addLoanValidation = (data) => {
  const schema = Joi.object({
    totalBillAmount: Joi.number(),
    downPayment: Joi.number(),
    loanAmount: Joi.number(),
    pendingPayment: Joi.number(),
    termInMonth: Joi.string(),
    interest: Joi.number(),
    monthlyInstallment: Joi.number(),
    customer: Joi.string(),
    verifiedBy: Joi.string(),
    completed: Joi.string(),
    read: Joi.string(),
    billNo: Joi.number(),
    loanNo: Joi.number(),
    qty: Joi.number(),
    fileCharges: Joi.number(),
    installmentsDate: Joi.string(),
    details: Joi.string(),
    gaurenterName: Joi.string(),
    gaurenterMobileNo: Joi.string(),
  });
  return schema.validate(data);
};

const updateLoanValidation = (data) => {
  const schema = Joi.object({
    totalBillAmount: Joi.number(),
    downPayment: Joi.number(),
    loanAmount: Joi.number(),
    pendingPayment: Joi.number(),
    termInMonth: Joi.string(),
    interest: Joi.number(),
    monthlyInstallment: Joi.number(),
    customer: Joi.string(),
    verifiedBy: Joi.string(),
    completed: Joi.string(),
    read: Joi.string(),
    billNo: Joi.number(),
    loanNo: Joi.number(),
    qty: Joi.number(),
    fileCharges: Joi.number(),
    installmentsDate: Joi.string(),
    details: Joi.string(),
    gaurenterName: Joi.string(),
    gaurenterMobileNo: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.addLoanValidation = addLoanValidation;
module.exports.updateLoanValidation = updateLoanValidation;
