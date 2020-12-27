const asyncHandler = require("../middlewares/asyncHandler");
const send = require("../utils/Send");
const ErrorResponse = require("../utils/errorResponse");

const map = require("../data/map");

const messages = { CREATED_KEY: "Created Key", DELETED_KEY: "Deleted Key" };

const CreateKeyVal = asyncHandler(async (req, res, next) => {
  const { key, val } = req.body;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  } else if (!val) {
    return next(new ErrorResponse("Please Provide a Value for the Key", 400));
  }

  map.add(key, val);

  send(res, 201, messages.CREATED_KEY);
});

const ReadKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.body;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  }

  const data = {
    key,
    val: map.get(key),
  };

  send(res, 200, data);
});

const DeleteKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.body;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  }

  map.delete(key);

  send(res, 200, messages.DELETED_KEY);
});

module.exports = {
  CreateKeyVal,
  ReadKeyVal,
  DeleteKeyVal,
};
