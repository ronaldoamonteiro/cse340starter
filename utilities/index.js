const { request } = require("express");
const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildCommentSection = async function (inventory_id, account_id) {
  let grid = "";
  const retrieveComments = await invModel.getCommentsByInvIdAndAccountId(
    inventory_id
  );

  grid += "<div class='comment-section'>";
  for (comment of retrieveComments) {
    const { account_firstname, account_lastname } =
      await accountModel.getAccountByAccountId(comment.account_id);
    grid += "<div class='individual-comment'>";
    grid += `<h3>${account_firstname} ${account_lastname}</h3>`;
    grid += `<span>Description: ${comment.comment_description}</span>`;
    grid += "<div class='comment-datetime'>";
    grid += `<span>Created at: ${Intl.DateTimeFormat("en-us", {
      timeStyle: "short",
      dateStyle: "short",
    }).format(comment.comment_created_at)}</span>`;
    grid += `<span>Updated at: ${Intl.DateTimeFormat("en-us", {
      timeStyle: "short",
      dateStyle: "short",
    }).format(comment.comment_updated_at)}</span>`;
    grid += "</div>";
    if (account_id === comment.account_id) {
      // res.locals.hasUserAlreadyCommented = true;
      grid += "<div class='button-container'>";
      grid += `<a class='outlined blue' href='/inv/detail/${inventory_id}/edit-comment/${comment.comment_id}'>Edit</a>`;
      grid += `<a class='outlined red' href='/inv/detail/${inventory_id}/delete-comment/${comment.comment_id}'>Delete</a>`;
      grid += "</div>";
    }
    grid += "</div>";
  }
  grid += "</div>";

  console.log({ grid });

  return grid;
};

Util.buildProductDetailView = async function (data, commentGrid) {
  let grid;
  if (data.length > 0) {
    grid = `<div id="product-detail-container">`;
    data.forEach((product) => {
      grid += "<span>";
      grid +=
        '<a id="product-detail-img" href="./' +
        product.inv_id +
        '" title="View ' +
        product.inv_make +
        " " +
        product.inv_model +
        'details"><img src="' +
        product.inv_image +
        '" alt="Image of ' +
        product.inv_make +
        " " +
        product.inv_model +
        ' on CSE Motors" /></a>';
      grid += "</span>";
      grid += '<ul class="product-info">';
      grid += '<li class="header">';
      grid += "<p>" + product.inv_description + "</p>";
      grid += "</li>";
      //
      grid += '<li class="additional-info">';
      grid += "<p><b>Make: </b> " + product.inv_make + "</p>";
      grid += "<p><b>Model: </b>" + product.inv_model + "</p>";
      grid += "<p><b>Color: </b>" + product.inv_color + "</p>";
      grid += "<p><b>Year: </b>" + product.inv_year + "</p>";
      grid +=
        "<p><b>Mileage: </b>" +
        Intl.NumberFormat("en-US").format(product.inv_miles) +
        "</p>";
      grid +=
        "<p><b>Price: </b>" +
        Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.inv_price) +
        "</p>";
      grid += "</li>";
      grid += "</ul>";
    });

    grid += "</div>";
    // Add Comment Button
    grid += `<button class='button'><a href='/inv/detail/${data[0].inv_id}/add-comment'>Add Comment</a></button>`;
    // Comment section
    grid += commentGrid;
  }

  return grid;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.buildClassificationList = async (classificationId = -1) => {
  console.log({ classificationId });
  const allClassifications = await invModel.getClassifications();
  let options = "";
  allClassifications.rows.forEach((option) => {
    options += `<option ${
      classificationId === option.classification_id ? "selected" : ""
    } value=${option.classification_id}>`;
    options += `${option.classification_name}`;
    options += "</option>";
  });

  return options;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please, log in!");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        // If there is not 'accountData' attribute, it creates one
        if (global.new_accountData) {
          res.locals.accountData = {
            ...accountData,
            ...global.new_accountData,
          };
        } else {
          res.locals.accountData = accountData;
        }

        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.authorizeView = (req, res, next) => {
  // Checks the account type and allows every user that has the account type of Employee or Admin

  if (
    res.locals.accountData &&
    ["Employee", "Admin"].includes(res.locals.accountData.account_type)
  ) {
    next();
  } else {
    req.flash("notice", "You are not authorized to access the current page!");
    return res.redirect("/account/login");
    next();
  }
};
module.exports = Util;
