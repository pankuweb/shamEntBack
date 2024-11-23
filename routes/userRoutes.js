const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.post(
  "/uploadPhoto",
  userController.uploadUserPhoto,
  userController.uploadPhoto
);

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    userController.getAllUsers
  )
  .post(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.createUser
  );

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
