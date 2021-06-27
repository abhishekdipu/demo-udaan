const mongoose = require("mongoose");

module.exports = () => {
  const connectionUrl = "mongodb://localhost/test-bar";
  mongoose
    .connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to mongodb....."))
    .catch((err) => console.log(err.message));
};
