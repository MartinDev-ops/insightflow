const pool = require("../config/db");

// Create a new project
const createProject = async (req, res) => {
    try {

        const { name, description, category } = req.body;

        // Validation
        if (!name || !category) {
            return res.status(400).json({
                message: "Project name and category are required."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO projects
            (name, description, category)
            VALUES ($1, $2, $3)
            RETURNING *;
            `,
            [name, description, category]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create project."
        });

    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM projects
            ORDER BY updated_at DESC;
        `);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch projects."
        });

    }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM projects
            WHERE id = $1;
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Project not found."
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch project."
        });

    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById
};