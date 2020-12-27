const fs = require("mz/fs");

const writeToFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data), {
      encoding: "utf-8",
    });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
    };
  }
};

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    return {
      data,
      success: true,
    };
  } catch (err) {
    console.log(err);

    return {
      data: null,
      success: false,
    };
  }
};

module.exports = { writeToFile, readFile };
