const express = require("express");

const router = express.Router();

const {
    cleanWorkbook
} = require("../controllers/cleanController");

router.post("/", cleanWorkbook);

module.exports = router;