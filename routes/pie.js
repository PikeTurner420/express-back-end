const { query } = require("express");
var express = require("express");
var router = express.Router();
const {
  getCountryTable,
  getCompanyPerCountryTable,
  getPurchasePerCountry,
} = require("../crud/Crud");

router.get("/", async (req, res) => {
  //list = await crud()
  list = [];
  console.table(list);
  res.json(list);
});

router.get("/countries", async (req, res) => {
  list = await getCountryTable();

  console.table(list);
  res.json(list);
});

router.get("/countries/purchase", async (req, res) => {
  queried = await getPurchasePerCountry();
  list = [];

  for (country of queried) {
    let dic = {};
    dic.id = country.country;
    dic.label = country.country;
    dic.value = country.count;
    list.push(dic);
  }
  console.table(list);
  res.json(list);
});

router.post("/", async (req, res) => {
  var country = req.body.country;
  var queried = await getCompanyPerCountryTable(req, res, country);

  list = [];

  for (company of queried) {
    let dic = {};
    dic.id = company.name;
    dic.label = company.name;
    dic.value = company.count;
    list.push(dic);
  }
  console.table(list);
  res.json(list);
});

module.exports = router;
