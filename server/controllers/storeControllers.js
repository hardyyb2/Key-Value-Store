const path = require("path");

const cache = require("../data/cache");
const { asyncHandler } = require("../middlewares");

const {
  readFile,
  writeToFile,
  errorResponse,
  messages,
  send,
} = require("../utils");

const PATH_TO_FILE = path.join(__dirname, "../data/data");

const CreateKeyVal = asyncHandler(async (req, res, next) => {
  const { key, val, ttl = -1 } = req.body;

  if (!key) {
    return next(new errorResponse(messages.PROVIDE_KEY, 400));
  } else if (!val) {
    return next(new errorResponse(messages.PROVIDE_VALUE, 400));
  }

  const existsInCache = cache.exists(key);

  const expires = ttl === -1 ? -1 : Date.now() + ttl * 1000;

  if (existsInCache) {
    let oldVal = cache.get(key);

    if (oldVal.expires > Date.now() || oldVal.expires === -1) {
      /** If exists in cache and  not expired
       *       return ALREADY EXISTS
       **/
      return send(res, 400, messages.ALREADY_EXISTS);
    } else {
      /** If exists in cache and expired
       *      replace old val with new in file and cache
       */
      checkFileExistsElseCreate(PATH_TO_FILE);

      let { data, success } = await readFile(PATH_TO_FILE);

      if (!success) {
        return next(new errorResponse(messages.SERVER_ERROR, 500));
      }

      if (data) {
        data = JSON.parse(data);
      } else {
        data = {};
      }

      // Replace old value with new value
      data[key] = { val, expires };
      cache.delete(key);
      cache.add(key, val, expires);
      return send(res, 201, messages.CREATED_KEY);
    }
  } else {
    /**
     * If doesn't exist in cache
     *    check in file
     */
    checkFileExistsElseCreate(PATH_TO_FILE);

    let { data, success } = await readFile(PATH_TO_FILE);

    if (!success) {
      return next(new errorResponse(messages.SERVER_ERROR, 500));
    }

    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }

    const existsInFile = data[key];

    if (existsInFile) {
      if (existsInFile.expires > Date.now() || existsInFile.expires === -1) {
        /**
         * If found in file and not expired
         *      save in cache and return
         */
        cache.add(key, val, expires);
        return next(new errorResponse(messages.ALREADY_EXISTS, 400));
      } else {
        /**
         * If found but expired
         *      replace in file, save in cache and return
         */

        data[key] = { val, expires };

        success = await writeToFile(PATH_TO_FILE, data);

        if (!success) {
          return next(new errorResponse(messages.SERVER_ERROR, 500));
        }

        cache.add(key, val, expires);
        return send(res, 201, messages.CREATED_KEY);
      }
    }

    /**
     * If does not exist in file
     *    Save in file and save in cache and return
     */

    data[key] = { val, expires };
    success = await writeToFile(PATH_TO_FILE, data);

    if (!success) {
      return next(new errorResponse(messages.SERVER_ERROR, 500));
    }

    cache.add(key, val, expires);

    return send(res, 201, messages.CREATED_KEY);
  }
});

const ReadKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  if (!key) {
    return next(new errorResponse(messages.PROVIDE_KEY, 400));
  }

  const existsInCache = cache.exists(key);

  if (existsInCache) {
    const val = cache.get(key);
    let expires = val.expires;

    if (expires > Date.now() || expires === -1) {
      /**
       * If found in cache and not expired
       *    return
       */
      return send(res, 200, { key, val });
    } else {
      /**
       * If found in cache but expired
       *    delete in file, delete in cache and return
       */

      checkFileExistsElseCreate(PATH_TO_FILE);

      let { data, success } = await readFile(PATH_TO_FILE);

      if (!success) {
        return next(new errorResponse(messages.SERVER_ERROR, 500));
      }

      if (data) {
        data = JSON.parse(data);
      } else {
        data = {};
      }

      if (data.hasOwnProperty(key)) {
        delete data[key];
        const success = await writeToFile(PATH_TO_FILE, data);

        if (!success) {
          return next(new errorResponse(messages.SERVER_ERROR, 500));
        }
        cache.delete(key);
        return send(res, 404, messages.NOT_FOUND);
      }
      return send(res, 404, messages.NOT_FOUND);
    }
  } else {
    /**
     * If doesn't exist in cache, check file
     */

    checkFileExistsElseCreate(PATH_TO_FILE);

    let { data, success } = await readFile(PATH_TO_FILE);

    if (!success) {
      return next(new errorResponse(messages.SERVER_ERROR, 500));
    }

    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }

    if (data.hasOwnProperty(key)) {
      if (data[key].expires > Date.now() || data[key].expires === -1) {
        /**
         * If found in file and not expired
         *    save in cache and return
         */
        cache.add(key, data[key]);
        return send(res, 200, { key, val: data[key] });
      } else {
        /**
         * If found in file and expired
         *    delete in file and return NOT FOUND
         */

        delete data[key];
        return send(res, 404, messages.NOT_FOUND);
      }
    } else {
      /**
       * If not found in file
       *    return NOT FOUND
       */

      return send(res, 404, messages.NOT_FOUND);
    }
  }
});

const DeleteKeyVal = asyncHandler(async (req, res, next) => {
  const { key } = req.params;

  if (!key) {
    return next(new errorResponse(messages.PROVIDE_KEY, 400));
  }

  checkFileExistsElseCreate(PATH_TO_FILE);

  let { data, success } = await readFile(PATH_TO_FILE);

  if (!success) {
    return next(new errorResponse(messages.SERVER_ERROR, 500));
  }

  if (data) {
    data = JSON.parse(data);
  } else {
    data = {};
  }

  if (data.hasOwnProperty(key)) {
    /**
     * If found in file
     *    delete in file, delete in cache and return
     */
    delete data[key];

    const success = await writeToFile(PATH_TO_FILE, data);

    if (!success) {
      return next(new errorResponse(messages.SERVER_ERROR, 500));
    }
    cache.delete(key);

    return send(res, 200, { message: messages.DELETED_KEY });
  } else {
    /**
     * If not found in file, check in cache
     *    delete in cache and return NOT FOUND
     */
    const existsInCache = cache.exists(key);

    if (existsInCache) {
      cache.delete(key);
    }

    return send(res, 404, messages.NOT_FOUND);
  }
});

module.exports = {
  CreateKeyVal,
  ReadKeyVal,
  DeleteKeyVal,
};
