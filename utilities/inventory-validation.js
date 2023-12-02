const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

validate.registerClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a classification name!")
      .custom(async (classification_name) => {
        const classificationNameExists =
          await inventoryModel.retrieveClassificationNamesByClassificationName(
            classification_name
          );
        if (classificationNameExists.length !== 0) {
          throw new Error("Classification name already exists");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Create Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

// Validation for inventory registration
// TODO: Remember to update the number fields pattern of the input type, in the future (when the internet is back)
validate.registerInventoryItemRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid make"),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid model"),
    body("inv_year")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Please, provide a valid year"),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid description"),
    body("inv_image")
      .trim()
      .customSanitizer((inv_image) =>
        inv_image === "" || inv_image == null
          ? `\\images\\vehicles\\no-image.png`
          : `\\images\\vehicles\\${inv_image}`
      ),
    body("inv_thumbnail")
      .trim()
      .customSanitizer((inv_thumbnail) =>
        inv_thumbnail === "" || inv_thumbnail == null
          ? `\\images\\vehicles\\no-image-tn.png`
          : `\\images\\vehicles\\${inv_thumbnail}`
      ),
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid price"),
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid mileage"),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid color"),
    body("classification_id")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please, provide a valid category")
      .custom(async (classification_id) => {
        const classificationIdExists =
          await inventoryModel.getClassificationByClassificationId(
            Number(classification_id)
          );
        if (classificationIdExists.length === 0) {
          throw new Error(
            "Category id does not exist. Please, provide a valid one"
          );
        }
      }),
  ];
};

validate.checkInventoryRegistrationData = async (req, res, next) => {
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
  let errors = [];
  // All the data is validated here, there is no need to make an extra request
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("./inventory/add-inventory", {
      errors,
      title: "Create Inventory Item",
      classificationSelect,
      nav,
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
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
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
  let errors = [];
  // All the data is validated here, there is no need to make an extra request
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("./inventory/add-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      classificationSelect,
      nav,
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
    });
    return;
  }
  next();
};

module.exports = validate;
