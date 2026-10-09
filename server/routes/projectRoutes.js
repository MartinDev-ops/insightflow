const express = require("express");
const router = express.Router();

const { requireVisitor } = require("../middleware/visitorAuth");
const { apiLimiter } = require("../middleware/rateLimit");

const {
    createProject,
    getProjects,
    getProjectById,
    renameProject,
    deleteProject
} = require("../controllers/projectController");

router.use(apiLimiter, requireVisitor);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.patch("/:id", renameProject);
router.delete("/:id", deleteProject);

module.exports = router;
