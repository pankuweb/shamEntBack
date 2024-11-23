const express = require("express");
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(authController.protect, bookController.createBook);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(authController.protect, bookController.deleteBook);

module.exports = router;
