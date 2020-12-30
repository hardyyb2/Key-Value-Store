const router = require("express").Router();

const { storeControllers } = require("../controllers");

const { ReadKeyVal, CreateKeyVal, DeleteKeyVal } = storeControllers;

router.route("/").post(CreateKeyVal);
router.route("/:key").get(ReadKeyVal).delete(DeleteKeyVal);

module.exports = router;
