const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController.js");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
