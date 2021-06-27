const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const { User, validate } = require("../models/users");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

//GET All
router.get("/", async (req, res) => {
  let users = await User.find();
  res.send(users);
});

//Create
router.post("/", async (req, res) => {
  //validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  //save to db
  let user = new User(
    _.pick(req.body, [
      "name",
      "phone",
      "pin",
      "role",
      "symptoms",
      "travelHistory",
      "contactWithCovidPatient",
    ])
  );
  user = await user.save();
  const token = user.generateAuthToken();

  if (req.body.role === "admin") {
    return res
      .status(201)
      .header("x-auth-token", token)
      .send({ adminId: user._id });
  }
  res.status(201).header("x-auth-token", token).send({ userId: user._id });
});

//Update results
router.post("/results", [auth, admin], async (req, res) => {
  //validate body
  const { error } = validateResults(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  //check for user and admin
  let user = await User.findOne({ _id: req.body.userId });
  let admin = await User.findOne({ _id: req.body.adminId });
  if (!user || !admin) return res.status(400).send("User/Admin do not exist");

  //update details
  const currentSituation = req.body.result;
  user = await User.updateOne(
    { _id: req.body.userId },
    {
      $set: {
        currentSituation: currentSituation,
      },
    }
  );

  res.status(201).send({ updated: true });
});

//Sample request - {"userId":"1","adminId":"2","result":"positive"}
const validateResults = (body) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    adminId: Joi.string().required(),
    result: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports = router;
