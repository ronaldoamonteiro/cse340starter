const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
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
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });

    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      // Removes the password key inside the accountData object and returns it to the client
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      // Creates the HttpOnly cookie
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account");
    }
  } catch (error) {
    throw new Error("Access Forbidden!");
  }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("account/management", {
    title: "Management View",
    nav,
    errors: null,
    classificationSelect,
  });
}

// Update Account View
async function buildEditAccountView(req, res, next) {
  // Retrieves the account id
  const accountId = parseInt(req.params.account_id);
  // Makes an API call to get the account info
  const accountData = await accountModel.getAccountByAccountId(accountId);
  let nav = await utilities.getNav();
  res.render("account/update-view", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

// Update Account Data
async function updateAccount(req, res, next) {
  // Get all the form data
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  // Get the current account info
  const currentAccountStatus = await accountModel.getAccountByAccountId(
    account_id
  );
  // Check whether e-mail exists
  const emailExists = await accountModel.checkExistingEmail(account_email);

  if (currentAccountStatus.account_email !== account_email && emailExists) {
    throw new Error("Email exists. Please log in or use different email");
  }
  const regResult = await accountModel.updateAccountData(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (regResult) {
    const currentAccountStatus = await accountModel.getAccountByAccountId(
      account_id
    );
    // "Global" variable

    delete currentAccountStatus.account_password;
    global.new_accountData = currentAccountStatus;
    // res.locals.accountData.account_firstname = currentAccountStatus;
    req.flash("notice", `Congratulations, you have updated the account data.`);
    return res.redirect("/account");
    next();
  } else {
    req.flash("notice", "Sorry, the update account procedure failed.");
    res.status(501).redirect("/account");
  }
}

// Update Account Password
async function updateAccountPassword(req, res, next) {
  const { account_password, account_id } = req.body;

  // Hash the password before storing/updating
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the hash.");
    return res.redirect("/account");
  }

  const regResult = await accountModel.updateAccountPassword(
    hashedPassword,
    account_id
  );

  if (regResult) {
    const currentAccountStatus = await accountModel.getAccountByAccountId(
      account_id
    );
    delete currentAccountStatus.account_password;
    // "Global" variable
    global.new_accountData = currentAccountStatus;
    req.flash("notice", `Congratulations, you have updated the password.`);
    return res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the update password procedure failed.");
    return res.redirect("/account/");
  }
}

async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "User has disconnected from the current session!");
  return res.redirect("/account/login");
  next();
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildManagementView,
  accountLogin,
  buildEditAccountView,
  updateAccount,
  updateAccountPassword,
  accountLogout,
};
