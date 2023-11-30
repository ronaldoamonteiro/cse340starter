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
    // Class name
    const className = (
      await invModel.getClassificationByClassificationId(
        Number(classification_id)
      )
    )[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid: grid,
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
      title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
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

    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
      classificationSelect,
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
  const classificationSelect = await utilities.buildClassificationList();

  if (regResult) {
    req.flash("notice", `Classification name successfully registered!`);
    const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the classification registration failed.");
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-classification", {
      title: "Create Classification",
      nav,
      classification_name,
      errors: null,
      classificationSelect,
    });
  }
};

// Add inventory view
// View for the classification form
invCont.showInventoryRegistrationView = async function (req, res, next) {
  try {
    // 'allClassifications' variable returns all the car categories/classifications saved in the database
    const classificationSelect = await utilities.buildClassificationList();
    // Call navbar and render the add-inventory.ejs view
    const nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
      title: "Register Inventory Item",
      nav,
      errors: null,
      classificationSelect, // selectOptions is the variable name for all the classification items
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
  const classificationSelect = await utilities.buildClassificationList();

  if (regResult) {
    req.flash("notice", `Inventory item successfully registered!`);
    const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the inventory item registration failed.");
    // const allClassifications = await invModel.getClassifications();
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/add-inventory", {
      title: "Register Inventory Item",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData.length === 0) {
    return res.json([]);
  }
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.editInventoryView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getProductByInventoryId(inv_id);
  // console.log({ itemData });
  const classificationSelect = await utilities.buildClassificationList();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

// Edit inventory post/put method
invCont.updateInventory = async (req, res) => {
  console.log({ body: req.body });
  const {
    inv_id,
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
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );
  if (updateResult) {
    req.flash("notice", `Inventory item successfully updated!`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the inventory item registration failed.");
    // const allClassifications = await invModel.getClassifications();
    const classificationSelect = await utilities.buildClassificationList();
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
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

invCont.buildDeleteInventoryItemView = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getProductByInventoryId(inv_id);
  // console.log({ itemData });
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

invCont.deleteInventoryItem = async (req, res) => {
  console.log({ body: req.body });
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  const deleteResult = await invModel.deleteInventoryItem(parseInt(inv_id));

  const classificationSelect = await utilities.buildClassificationList();
  if (deleteResult) {
    req.flash("notice", "Inventory item successfully deleted!");
    const nav = await utilities.getNav();
    res.status(201).render("./inventory/management", {
      title: "Management View",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the inventory item deletion failed.");
    let nav = await utilities.getNav();
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

// TODO: Create controller for inventory form
// TODO: Create model as well
module.exports = invCont;
