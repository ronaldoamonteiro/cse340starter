// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.showProductByInvId);
router.get("/broken", invController.showBrokenPage);

router.get("/", utilities.handleErrors(invController.showManagementView));
router.get(
  "/classification",
  utilities.handleErrors(invController.showClassificationView)
);
router.post(
  "/classification",
  invValidate.registerClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// It will display the view for the inventory registration
router.get(
  "/create",
  utilities.handleErrors(invController.showInventoryRegistrationView)
);
// Handles the form submission for the inventory page

router.post(
  "/create",
  invValidate.registerInventoryItemRules(),
  invValidate.checkInventoryRegistrationData,
  utilities.handleErrors(invController.addInventoryItem)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;
