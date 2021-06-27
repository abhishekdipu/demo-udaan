const express = require("express");
const dbsetups = require("./setups/db");
const usersRoute = require("./routes/users");
const assesmentRoute = require("./routes/assesment");
const zoneRoute = require("./routes/zone");
const app = express();
app.use(express.json());

dbsetups();
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/users", usersRoute);
app.use("/api/assesment", assesmentRoute);
app.use("/api/zone", zoneRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listing on ${PORT}...`));
