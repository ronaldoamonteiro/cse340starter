const utilities = require("../utilities");
const accountModel = require("../models/account-model");

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null,
  });
}

async function validateLogin(req, res) {
  let nav = await utilities.getNav();

  const { account_email, account_password } = req.body;

  const regResult = await accountModel.checkExistingEmail(account_email);

  console.log({ regResult });

  // if (regResult != null && account_password === regResult?.account_password) {
  //   req.flash("notice", "You are logged in!");
  //   res.status(201).render("account/login", {
  //     title: "Login",
  //     nav,
  //     errors: null,
  //   });
  // }
  if (regResult === 1) {
    req.flash("notice", "You are logged in!");
    res.status(201).render("", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, email and password do not match.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  console.log({ req: req.body });
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, validateLogin };
