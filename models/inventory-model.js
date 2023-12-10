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
    return data.rows[0];
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

async function updateInventory(
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
) {
  try {
    const sql = `UPDATE public.inventory SET
      inv_make = $1,
      inv_model = $2,
      inv_description = $3,
      inv_image = $4,
      inv_thumbnail = $5,
      inv_price = $6,
      inv_year = $7,
      inv_miles = $8,
      inv_color = $9,
      classification_id = $10 WHERE inv_id = $11 RETURNING *`;
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    throw new Error("Delete Inventory Error");
  }
}

/* ***************************
 *  Comment Section
 * ************************** */
async function registerComment(comment_description, inv_id, account_id) {
  try {
    const created_comment = new Date().toISOString();
    const sql =
      "INSERT INTO public.comment (comment_description, comment_created_at, comment_updated_at, inv_id, account_id) VALUES ($1, $2, $3, $4, $5)";
    const data = await pool.query(sql, [
      comment_description,
      created_comment,
      created_comment,
      inv_id,
      account_id,
    ]);

    return data.rows;
  } catch (error) {
    throw new Error(
      "User has already commented in this inventory item! You are not allowed to insert a new comment! Please, edit your original one!"
    );
  }
}

async function getCommentsByInvIdAndAccountId(inv_id) {
  try {
    const sql = "SELECT * FROM public.comment WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    throw new Error("Error retrieving comments");
  }
}
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getProductByInventoryId,
  registerClassificationByClassificationName,
  retrieveClassificationNamesByClassificationName,
  getClassificationByClassificationId,
  registerInventoryItem,
  updateInventory,
  deleteInventoryItem,
  registerComment,
  getCommentsByInvIdAndAccountId,
};
