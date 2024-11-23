const express = require("express");
const installmentController = require("../controllers/installmentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

router.route("/").get(installmentController.getAllInstallments);

router
  .route("/:id")
  .post(installmentController.createInstallment)
  .get(installmentController.getInstallment)
  .patch(installmentController.updateInstallment)
  .delete(installmentController.deleteInstallment);

module.exports = router;
