const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code,
        message: e.message,
      });
    }
  }
};

/* ***************************
 *  Build product view by inventory id
 * ************************** */
invCont.showProductByInvId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getProductByInventoryId(inventory_id);
    const grid = await utilities.buildProductDetailView(data);
    let nav = await utilities.getNav();
    res.render("./inventory/classification", {
      title:
        data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
      nav,
      grid,
      errors: null,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code,
        message: e.message,
      });
    }
  }
};

invCont.showBrokenPage = async function (req, res, next) {
  try {
    throw new Error({ message: "Broken page", status: 500 });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({ status: 500, message: "Sorry, internal server error." });
    }
  }
};

invCont.showManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code,
        message: e.message,
      });
    }
  }
};

// View for the classification form
invCont.showClassificationView = async function (req, res, next) {
  try {
    // Call navbar and render the add-classification.ejs view
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Create Classification",
      nav,
      errors: null,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code,
        message: e.message,
      });
    }
  }
};

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;

  const regResult = await invModel.registerClassificationByClassificationName(
    classification_name
  );

  // TODO:  CHECK Default feedback of a POST request

  if (regResult) {
    req.flash("notice", `Classification name successfully registered!`);
    const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the classification registration failed.");
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-classification", {
      title: "Create Classification",
      nav,
      classification_name,
      errors: null,
    });
  }
};

// Add inventory view
// View for the classification form
invCont.showInventoryRegistrationView = async function (req, res, next) {
  try {
    // 'allClassifications' variable returns all the car categories/classifications saved in the database
    const allClassifications = await invModel.getClassifications();
    console.log({ allClassifications: allClassifications.rows });
    // Call navbar and render the add-inventory.ejs view
    const nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
      title: "Register Inventory Item",
      nav,
      errors: null,
      selectOptions: allClassifications.rows, // selectOptions is the variable name for all the classification items
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code,
        message: e.message,
      });
    }
  }
};

// Add inventory post
invCont.addInventoryItem = async (req, res) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const regResult = await invModel.registerInventoryItem(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (regResult) {
    req.flash("notice", `Inventory item successfully registered!`);
    const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the inventory item registration failed.");
    const allClassifications = await invModel.getClassifications();
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-inventory", {
      title: "Register Inventory Item",
      nav,
      selectOptions: allClassifications.rows,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null,
    });
  }
};

// TODO: Create controller for inventory form
// TODO: Create model as well
module.exports = invCont;
