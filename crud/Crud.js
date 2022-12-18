const { pool } = require("../db");
//var {Pool} = require('pg');

const getCountryTable = async (request, response) => {
  const results = await pool.query(`SELECT DISTINCT company.country 
                                      FROM company INNER JOIN company_purchase ON company.id = company_purchase.id_company
                                      `);
  return results.rows;
};

const getPurchasePerCountry = async (request, response) => {
  const results = await pool.query(`
                                     SELECT company.country as "country", count(company_purchase.id) from company 
                                     INNER JOIN company_purchase ON company_purchase.id_company = company.id
                                     group by country;
                                     `);
  return results.rows;
};

const getCompanyPerCountryTable = async (request, response, country) => {
  console.log(country);
  var query = `
                SELECT company.name, COUNT(*) AS "count"
                FROM company 
                INNER JOIN company_purchase ON company.id = company_purchase.id_company 
                WHERE company.country = ($1) 
                GROUP BY company.id
                `;
  const results = await pool.query(query, [country]);
  return results.rows;
};

const validateUser = async (request, response, username, pwd) => {
  console.log(username, pwd);
  const results = await pool.query(
    "SELECT * FROM admins WHERE username = ($1) AND password = ($2)",
    [username, pwd]
  );
  console.log(results.rows);
  try {
    results.rows[0].username == username && results.rows[0].password == pwd;
    return { auth: true };
  } catch {
    return { auth: false, error: "wrong username or password" };
  }
};

const getMonthEarn = async (request, response, month, year) => {
  var date1 = year + "/" + month + "/" + 01;
  var date2 = year + "/" + month + "/" + 31;
  const company = await pool.query(
    `SELECT SUM(product.price) 
     FROM product 
     INNER JOIN product_key ON product.id = product_key.id_product
     INNER JOIN company_purchase ON product_key.id = company_purchase.id_key
     where date between ($1) and ($2)
    `,
    [date1, date2]
  );
  const private = await pool.query(
    `SELECT SUM(product.price) 
     FROM product 
     INNER JOIN product_key ON product.id = product_key.id_product
     INNER JOIN private_purchase ON product_key.id = private_purchase.id_key
     where date between ($1) and ($2)
    `,
    [date1, date2]
  );
  //console.log(company.rows , private.rows);
  var i = 0;
  i = parseInt(company.rows[0].sum) + parseInt(private.rows[0].sum);
  results = [];
  results[0] = {
    sum: i,
  };
  return results;
};

const deleteCompanyByID = async (req, res, id) => {
  await pool.query("DELETE FROM company_purchase WHERE id_company=($1)", [id]);
  await pool.query("DELETE FROM company WHERE id=($1)", [id]);
};

const deletePrivateByID = async (req, res, id) => {
  await pool.query("DELETE FROM private_purchase WHERE id_private=($1)", [id]);
  await pool.query("DELETE FROM private WHERE id=($1)", [id]);
};

module.exports = {
  getCountryTable,
  getCompanyPerCountryTable,
  getPurchasePerCountry,
  getMonthEarn,
  validateUser,
  deleteCompanyByID,
  deletePrivateByID,
};
