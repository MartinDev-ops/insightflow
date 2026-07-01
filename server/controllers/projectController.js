const pool = require("../config/db");

const createProject = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const result = await pool.query(
            `
            INSERT INTO projects
            (name, description, category)
            VALUES ($1,$2,$3)
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

module.exports = {
    createProject,
    getProjects
};