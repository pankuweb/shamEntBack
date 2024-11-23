const express = require("express");
const billController = require("../controllers/billController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(billController.getAllBills)
  .post(billController.createBill);

router.route("/:id").delete(billController.deleteBill);

module.exports = router;
