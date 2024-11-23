const Joi = require("joi");

//Loan Validation
const addInstallmentValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    amount: Joi.number(),
    date: Joi.string(),
    // _id: Joi.string(),
    insId: Joi.string(),
  });
  return schema.validate(data);
};

const updateInstallmentValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    amount: Joi.number(),
    date: Joi.string(),
    // _id: Joi.string(),
    insId: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.addInstallmentValidation = addInstallmentValidation;
module.exports.updateInstallmentValidation = updateInstallmentValidation;
