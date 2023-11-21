const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildProductDetailView = async function (data) {
  let grid;
  if(data.length > 0) {
    grid = `<div id="product-detail-container">`;
    data.forEach(product => {
      grid += '<span>'
        grid += '<a id="product-detail-img" href="./'+ product.inv_id 
          + '" title="View ' + product.inv_make + ' '+ product.inv_model 
          + 'details"><img src="' + product.inv_image 
          +'" alt="Image of '+ product.inv_make + ' ' + product.inv_model 
          + ' on CSE Motors" /></a>'
      grid += '</span>';
      grid += '<ul class="product-info">';
        grid += '<li class="header">';
          grid += '<p>' + product.inv_description + '</p>';
        grid += '</li>';
        // 
        grid += '<li class="additional-info">';
          grid += '<p><b>Make: </b> ' + product.inv_make + '</p>';
          grid += '<p><b>Model: </b>' + product.inv_model + '</p>';
          grid += '<p><b>Color: </b>' + product.inv_color + '</p>';
          grid += '<p><b>Year: </b>' + product.inv_year + '</p>';
          grid += '<p><b>Mileage: </b>' + product.inv_miles + '</p>';
          grid += '<p><b>Price: </b>' + Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(product.inv_price) + '</p>';
        grid += '</li>'
      grid += '</ul>'
    })
    grid += '</div>';
  }


  return grid;
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util