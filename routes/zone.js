const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/users");

/**
 * 
 * Sample request - {"pinCode":"111111"}
Sample response - {"numCases":"1","zoneType":"ORANGE"}

ZONES:
Mark zones (pin codes) as green, orange and red based on positive covid cases.
Default zone - GREEN
<5 cases in a zone - ORANGE
>5 cases in a zone - RED



 */

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const pinCode = req.body.pinCode;
  let zone = "Green"; //Default zone - GREEN

  let currentSituations = await User.find({ pin: pinCode }).select(
    "currentSituation"
  );

  console.log(currentSituations);
  res.send("Green");
});

const validate = (body) => {
  const schema = Joi.object({
    pinCode: Joi.string().required(),
  });

  return schema.validate(body);
};

module.exports = router;
