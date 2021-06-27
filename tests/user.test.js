const jest = require("jest");

const dbMock = () => {
  return new Promise((resolve, reject) => {
    resolve("true");
  });
};
