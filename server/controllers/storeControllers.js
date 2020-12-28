const path = require("path");

const asyncHandler = require("../middlewares/asyncHandler");
const send = require("../utils/Send");
const ErrorResponse = require("../utils/errorResponse");

const cache = require("../data/cache");
const { readFile, writeToFile } = require("../utils/fileOperations");

const messages = {
  CREATED_KEY: "Created Key",
  DELETED_KEY: "Deleted Key",
  ALREADY_EXISTS: "Already Exists",
  NOT_FOUND: "Not Found",
};

const PATH_TO_FILE = path.join(__dirname, "../data/data");

const CreateKeyVal = asyncHandler(async (req, res, next) => {
  const { key, val } = req.body;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  } else if (!val) {
    return next(new ErrorResponse("Please Provide a Value for the Key", 400));
  }

  const existsInCache = cache.exists(key);

  if (existsInCache) {
    return send(res, 400, { message: messages.ALREADY_EXISTS });
  } else {
    let { data, success } = await readFile(PATH_TO_FILE);

    if (!success) {
      return next(new ErrorResponse("Server Error, Please try again", 500));
    }

    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }

    const existsInFile = data[key];

    if (existsInFile) {
      cache.add(key, val);
      return next(new ErrorResponse("Already Exists", 400));
    }

    data[key] = val;
    success = await writeToFile(PATH_TO_FILE, data);

    if (!success) {
      return next(new ErrorResponse("Server Error, Please try again", 500));
    }

    console.log(cache, data);

    return send(res, 201, messages.CREATED_KEY);
  }
});

const ReadKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  }

  const existsInCache = cache.exists(key);

  if (existsInCache) {
    const val = cache.get(key);
    return send(res, 200, { key, val });
  } else {
    let { data, success } = await readFile(PATH_TO_FILE);

    if (!success) {
      return next(new ErrorResponse("Server Error, Please try again", 500));
    }

    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }

    console.log(cache, data);

    if (data.hasOwnProperty(key)) {
      cache.add(key, data[key]);
      return send(res, 200, { key, val: data[key] });
    } else {
      return send(res, 404, messages.NOT_FOUND);
    }
  }
});

const DeleteKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  if (!key) {
    return next(new ErrorResponse("Please Provide a Key", 400));
  }

  let { data, success } = await readFile(PATH_TO_FILE);

  if (!success) {
    return next(new ErrorResponse("Server Error, Please try again", 500));
  }

  if (data) {
    data = JSON.parse(data);
  } else {
    data = {};
  }

  console.log(cache, data);

  if (data.hasOwnProperty(key)) {
    delete data[key];
    cache.delete(key);

    const success = await writeToFile(PATH_TO_FILE, data);

    if (!success) {
      return next(new ErrorResponse("Server Error, Please try again", 500));
    }
    return send(res, 200, { message: messages.DELETED_KEY });
  } else {
    const existsInCache = cache.exists(key);

    if (existsInCache) {
      cache.delete(key);
    }

    return send(res, 404, { message: messages.NOT_FOUND });
  }
});

module.exports = {
  CreateKeyVal,
  ReadKeyVal,
  DeleteKeyVal,
};