const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (e) {
    if(e instanceof Error) {
      console.log(e.message)
      next({
        status: e.code, message: e.message
      });
    }
  }
}

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
      title: data[0].inv_year + ' '  + data[0].inv_make + ' ' + data[0].inv_model,
      nav,
      grid
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({
        status: e.code, message: e.message
      });
    }
  }
}


invCont.showBrokenPage = async function (req, res, next) {
  try {
    throw new Error({message: 'Broken page', status: 500})
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      next({status: 500, message: 'Sorry, internal server error.'});
    }
  }
}

module.exports = invCont