const express = require("express");
const loanController = require("../controllers/loanController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

router
  .route("/")
  .get(loanController.getAllLoans)
  .post(
    loanController.uploadLoanPhoto,
    loanController.resizeLoanPhoto,
    loanController.createLoan
  );

router.route("/upcoming-loans").get(loanController.getComingLoans);

router.route("/todays-loans").get(loanController.getTodaysLoans);

router.route("/notifications").get(loanController.getNotifications);

router.route("/filtered-loans").get(loanController.getFilteredLoans);

router.route("/overdue-loans").get(loanController.getOverdueLoans);

router.route("/loan-reports").get(loanController.getLoansBetweenTwoDates);

router.route("/close-loan/:id").patch(loanController.CloseLoan);

router.route("/reopen-loan/:id").patch(loanController.reopenLoan);
router
  .route("/:id")
  .get(loanController.getLoan)
  .patch(
    loanController.uploadLoanPhoto,
    loanController.resizeLoanPhoto,
    loanController.updateLoan
  )
  .delete(loanController.deleteLoan);

module.exports = router;
