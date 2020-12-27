const router = require("express").Router();

const {
  ReadKeyVal,
  CreateKeyVal,
  DeleteKeyVal,
} = require("../controllers/storeControllers");

router.route("/").get(ReadKeyVal).post(CreateKeyVal).delete(DeleteKeyVal);

module.exports = router;
