const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController.js");
const accountValidation = require("../utilities/account-validation.js");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  accountValidation.registrationRules(), // Sanitizes the data
  accountValidation.checkRegData, //
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  accountValidation.loginFormValidation(),
  accountValidation.checkLoginData, // If there is an error, it goes back to the same page
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView)
);

// Update Account Information view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildEditAccountView)
);
// Update account (without password)
router.post(
  "/update-account",
  accountValidation.accountUpdateRules(),
  accountValidation.accountDataUpdate,
  utilities.handleErrors(accountController.updateAccount)
);
// Update account password
router.post(
  "/update-password",
  accountValidation.accountPasswordUpdateRules(),
  accountValidation.accountPasswordDataUpdate,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;
