var express = require("express");
var router = express.Router();
const {} = require("../crud/Crud");

router.get("/", async (req, res) => {
  //list = await getUserTable()
  list = [];
  console.table(list);
  res.json(list);
});
module.exports = router;
