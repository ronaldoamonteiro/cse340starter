const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );

    console.log("Rows: ", data.rows);
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

// Get all classifications by its classification id
async function getClassificationByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1",
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("error on classification id retrieval: ", error);
  }
}

async function getProductByInventoryId(inv_id) {
  try {
    // returns everything for the current inv_id
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getproductbyclassificationid error: ", error);
  }
}

async function retrieveClassificationNamesByClassificationName(
  classification_name
) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_name = $1`,
      [classification_name]
    );

    return data.rows;
  } catch (e) {
    console.error("retrieve classification names error: ", error);
  }
}

async function registerClassificationByClassificationName(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    );
    return data.rows;
  } catch (e) {
    console.error("create classification error: ", error);
  }
}

async function registerInventoryItem(
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
) {
  const data = await pool.query(
    `INSERT INTO public.inventory (
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id) VALUES ($1, $2,$3, $4, $5, $6, $7, $8, $9, $10)`,
    [
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
    ]
  );

  return data.rows;
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getProductByInventoryId,
  registerClassificationByClassificationName,
  retrieveClassificationNamesByClassificationName,
  getClassificationByClassificationId,
  registerInventoryItem,
};
