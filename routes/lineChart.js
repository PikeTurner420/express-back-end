var express = require("express");
var router = express.Router();
const { getYearEarnPerCountry } = require("../crud/Crud");

router.get("/yearData", async (req, res) => {
  const date = new Date();
  let year = date.getFullYear();
  list = await getYearEarnPerCountry(req, res, year);
  console.table(list);
  res.json(list);
});
module.exports = router;
