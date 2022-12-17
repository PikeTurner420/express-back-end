var express = require("express");
var router = express.Router();
const { getMonthEarn } = require("../crud/Crud");

router.get("/monthearn", async (req, res) => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  list = await getMonthEarn(req, res, month, year);
  console.table(list);
  res.json(list);
});
module.exports = router;
