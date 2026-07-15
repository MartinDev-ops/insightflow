const express = require("express");

const router = express.Router();

const {

    exportWorkbook

} = require("../controllers/exportController");

router.get("/:projectId", exportWorkbook);

module.exports = router;