const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/users");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ _id: req.body.userId });
  if (!user) return res.status(400).send("User do not exist");

  const symptoms = req.body.symptoms;
  const travelHistory = req.body.travelHistory;
  const contactWithCovidPatient = req.body.contactWithCovidPatient;

  user = await User.updateOne(
    { _id: req.body.userId },
    {
      $set: {
        symptoms: symptoms,
        travelHistory: travelHistory,
        contactWithCovidPatient: contactWithCovidPatient,
      },
    }
  );

  const symptomsCount = req.body.symptoms.length;
  const haveTravelHistory = req.body.travelHistory;
  const haveContactWithCovidPatient = req.body.contactWithCovidPatient;

  let risk = 0;
  if (symptomsCount === 1 && (haveTravelHistory || haveContactWithCovidPatient))
    risk = 50;
  else if (
    symptomsCount === 2 &&
    (haveTravelHistory || haveContactWithCovidPatient)
  )
    risk = 75;
  else if (
    symptomsCount >= 2 &&
    (haveTravelHistory || haveContactWithCovidPatient)
  )
    risk = 95;
  else risk = 5;

  res.status(201).send({ riskPercentage: risk });
});

const validate = (body) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    symptoms: Joi.array().required(),
    travelHistory: Joi.boolean().required(),
    contactWithCovidPatient: Joi.boolean().required(),
  });

  return schema.validate(body);
};

module.exports = router;
