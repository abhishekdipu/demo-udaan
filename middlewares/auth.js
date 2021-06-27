const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied: token not provided");

  try {
    const payload = jwt.verify(token, "1020");
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).send("Invalid token");
  }
};
