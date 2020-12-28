const fs = require("mz/fs");

const checkFileExistsElseCreate = (filePath) => {
  let fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    fs.writeFile(filePath, "", { flag: "wx" }, function (err) {
      if (err) throw err;
    });
  }
};

module.exports = checkFileExistsElseCreate;
