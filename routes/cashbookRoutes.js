const express = require("express");
const cashbookController = require("../controllers/cashbookController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(cashbookController.getAllCashbooks)
  .post(authController.protect, cashbookController.createCashbook);

router
  .route("/:id")
  .delete(authController.protect, cashbookController.deleteCashbook);

module.exports = router;
