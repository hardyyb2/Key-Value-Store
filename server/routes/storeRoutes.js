const router = require("express").Router();

const {
  ReadKeyVal,
  CreateKeyVal,
  DeleteKeyVal,
} = require("../controllers/storeControllers");

router.route("/").post(CreateKeyVal);
router.route("/:key").get(ReadKeyVal).delete(DeleteKeyVal);

module.exports = router;
