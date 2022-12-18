var express = require("express");
var router = express.Router();
const { deleteCompanyByID, deletePrivateByID } = require("../crud/Crud");

router.delete("/deletecompany/:id", async (req, res) => {
  const { id } = req.params;
  list = await deleteCompanyByID(req, res, id);
  res.status(200);
});

router.delete("/deleteprivate/:id", async (req, res) => {
  const { id } = req.params;
  list = await deletePrivateByID(req, res, id);
  res.status(200);
});
module.exports = router;
