const express = require("express");
const router = express.Router();


const {
    createProject,
    getProjects,
    getProjectById
} = require("../controllers/projectController");

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

module.exports = router;