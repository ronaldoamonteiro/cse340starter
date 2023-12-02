const pool = require("../database");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAccountByEmail(account_email) {
  try {
    const sql =
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rows[0];
  } catch (error) {
    throw new Error("No matching email found");
  }
}

async function getAccountByAccountId(account_id) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_id = $1";
    const data = await pool.query(sql, [account_id]);
    return data.rows[0];
  } catch {
    throw new Error("Account not found!");
  }
}

async function updateAccountData(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const query =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4";
    const data = await pool.query(query, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);

    return data.rows;
  } catch {
    throw new Error("Update account data procedure failed!");
  }
}

async function updateAccountPassword(account_password, account_id) {
  try {
    const query =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2";
    const data = await pool.query(query, [account_password, account_id]);
    return data.rows;
  } catch {
    throw new Error("Update password procedure failed!");
  }
}
module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountByAccountId,
  updateAccountData,
  updateAccountPassword,
};
