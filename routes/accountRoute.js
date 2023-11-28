const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController.js");
const regValidate = require("../utilities/account-validation.js");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registrationRules(), // Sanitizes the data
  regValidate.checkRegData, //
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginFormValidation(),
  regValidate.checkLoginData, // If there is an error, it goes back to the same page
  utilities.handleErrors(accountController.validateLogin)
);

module.exports = router;
