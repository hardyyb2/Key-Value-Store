const asyncHandler = require("../middlewares/asyncHandler");
const send = require("../utils/Send");

const CreateKeyVal = asyncHandler(async (req, res, next) => {
  const data = {
    test: "Test",
  };
  console.log(req.body);
  send(res, 200, data);
});

const ReadKeyVal = asyncHandler(async (req, res, next) => {
  const data = {
    test: "Test",
  };
  console.log(req.body);

  send(res, 200, data);
});

const DeleteKeyVal = asyncHandler(async (req, res, next) => {
  const data = {
    test: "Test",
  };
  console.log(req.body);

  send(res, 200, data);
});

module.exports = {
  CreateKeyVal,
  ReadKeyVal,
  DeleteKeyVal,
};
