const asyncHandler = require("../middlewares/asyncHandler");
const send = require("../utils/Send");

const TestController = asyncHandler(async (req, res, next) => {
  const data = {
    test: "Test",
  };
  send(res, 200, data);
});

module.exports = {
  TestController,
};
