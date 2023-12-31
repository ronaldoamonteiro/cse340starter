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

router.get(
  "/",
  utilities.authorizeView,
  utilities.handleErrors(invController.showManagementView)
);
router.get(
  "/classification",
  utilities.authorizeView,
  utilities.handleErrors(invController.showClassificationView)
);
router.post(
  "/classification",
  utilities.authorizeView,
  invValidate.registerClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// It will display the view for the inventory registration
router.get(
  "/create",
  utilities.authorizeView,
  utilities.handleErrors(invController.showInventoryRegistrationView)
);
// Handles the form submission for the inventory page

router.post(
  "/create",
  utilities.authorizeView,
  invValidate.registerInventoryItemRules(),
  invValidate.checkInventoryRegistrationData,
  utilities.handleErrors(invController.addInventoryItem)
);

router.get(
  "/getInventory/:classification_id",
  utilities.authorizeView,
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.authorizeView,
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  utilities.authorizeView,
  invValidate.registerInventoryItemRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.authorizeView,
  utilities.handleErrors(invController.buildDeleteInventoryItemView)
);

router.post(
  "/delete",
  utilities.authorizeView,
  utilities.handleErrors(invController.deleteInventoryItem)
);

/**
 *
 * Comments routes
 */
router.get(
  "/detail/:inv_id/add-comment",
  utilities.handleErrors(invController.buildCreateCommentView)
);
router.post(
  "/detail/:inv_id/add-comment",
  invValidate.commentRules(),
  invValidate.checkAddCommentData,
  utilities.handleErrors(invController.addCommentForInventoryItem)
);

// Edit Comment Page
router.get(
  "/detail/:inv_id/edit-comment/:comment_id",
  utilities.handleErrors(invController.buildEditCommentView)
);
// Edit comment submission
router.post(
  "/detail/:inv_id/edit-comment/:comment_id",
  invValidate.commentRules(),
  invValidate.checkEditCommentData,
  utilities.handleErrors(invController.editCommentForInventoryItem)
);

router.get(
  "/detail/:inv_id/delete-comment/:comment_id",
  utilities.handleErrors(invController.buildDeleteCommentView)
);

router.post(
  "/detail/:inv_id/delete-comment/:comment_id",
  utilities.handleErrors(invController.deleteCommentForInventoryView)
);

module.exports = router;
