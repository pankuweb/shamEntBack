const express = require("express");
const priceController = require("../controllers/priceController");

const router = express.Router();

router
  .route("/")
  .post(priceController.createPrice)
  .get(priceController.getAllPrice);

router.route("/:id").patch(priceController.updatePrice);

module.exports = router;
