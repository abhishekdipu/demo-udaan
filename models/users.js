const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    emum: ["user", "admin"],
    default: "user",
  },
  symptoms: {
    type: Array,
    default: [],
  },
  travelHistory: {
    type: Boolean,
    default: false,
  },
  contactWithCovidPatient: {
    type: Boolean,
    default: false,
  },
  currentSituation: {
    type: String,
    default: "",
  },
});

/*
{"userId":"1","symptoms":["fever","cold","cough"],"travelHistory":true,"contactWithCovidPatient":true}
Sample response - {"riskPercentage": 95}
*/
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, role: this.role }, "1020");
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(20),
    phone: Joi.string().required().min(2).max(20),
    pin: Joi.string().required().min(2).max(10),
    role: Joi.string().valid("user", "admin"),
  });

  return schema.validate(body);
};

module.exports.User = User;
module.exports.validate = validate;
