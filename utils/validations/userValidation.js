const Joi = require("joi");

//Registration Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().required(),
  });
  return schema.validate(data);
};

//Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

//Create User Validation
const createUserValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    relation: Joi.string(),
    relativeFirstName: Joi.string(),
    relativeLastName: Joi.string(),
    mobile: Joi.number(),
    adharNo: Joi.string(),
    state: Joi.string(),
    dob: Joi.string(),
    distt: Joi.string(),
    city: Joi.string(),
    pinCode: Joi.string(),
    correspondAddress: Joi.string(),
    permanentAddress: Joi.string(),
    nearAbout: Joi.string(),
    gender: Joi.string(),
    photo: Joi.string(),
    password: Joi.string(),
  });
  return schema.validate(data);
};

//Update User Validation
const updateUserValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    relation: Joi.string(),
    relativeFirstName: Joi.string(),
    relativeLastName: Joi.string(),
    mobile: Joi.number(),
    adharNo: Joi.string(),
    state: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string(),
    distt: Joi.string(),
    city: Joi.string(),
    pinCode: Joi.string(),
    correspondAddress: Joi.string(),
    permanentAddress: Joi.string(),
    nearAbout: Joi.string(),
    photo: Joi.string(),
    password: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateUserValidation = updateUserValidation;
module.exports.createUserValidation = createUserValidation;
