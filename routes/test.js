const router = require("express").Router();

const { TestController } = require("../controllers/test");

router.route("/").get(TestController);

module.exports = router;
