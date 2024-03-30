const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const multer = require("multer");
const { storage2 } = require("../cloudconfig.js");
const upload = multer({ storage2});

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(
    upload.single('profile[image]'),   // multer process enc-type data to storage2
    wrapAsync(userController.signup),
    
  );

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
