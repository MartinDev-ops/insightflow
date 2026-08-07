const pool = require("../config/db");
const { getVisitorId } = require("../utils/visitor");

// Create a new project
const createProject = async (req, res) => {

    try {

        const { name, description, category } = req.body;
        const ownerId = getVisitorId(req);

        if (!name || !category) {

            return res.status(400).json({
                message: "Project name and category are required."
            });

        }

        if (!ownerId) {

            return res.status(400).json({
                message: "Visitor ID is required."
            });

        }

        // Create project
        const projectResult = await pool.query(
            `
            INSERT INTO projects
            (name, description, category, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [name, description, category, ownerId]
        );

        const project = projectResult.rows[0];

        // -----------------------------
        // Create an empty workbook
        // -----------------------------

        const emptyWorkbook = [

            {

                name: "Sheet1",

                rowCount: 100,

                columnCount: 26,

                columns: Array.from({ length: 26 }, () => ({
                    width: 10
                })),

                merges: [],

                rows: Array.from({ length: 100 }, () => ({
                    height: 23,
                    cells: []
                }))

            }

        ];

        await pool.query(
            `
            INSERT INTO workbooks
            (project_id, workbook_data)
            VALUES ($1, $2);
            `,
            [
                project.id,
                JSON.stringify(emptyWorkbook)
            ]
        );

        res.status(201).json(project);

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

        const ownerId = getVisitorId(req);

        if (!ownerId) {

            return res.status(200).json([]);

        }

        const result = await pool.query(
            `
            SELECT *
            FROM projects
            WHERE owner_id = $1
            ORDER BY updated_at DESC;
            `,
            [ownerId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch projects."
        });

    }

};

// Get a single project
const getProjectById = async (req, res) => {

    try {

        const { id } = req.params;
        const ownerId = getVisitorId(req);

        const result = await pool.query(
            `
            SELECT *
            FROM projects
            WHERE id = $1 AND owner_id = $2;
            `,
            [id, ownerId]
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

const renameProject = async (req, res) => {
    try {
        const { id } = req.params;
        const name = req.body.name?.trim();
        const ownerId = getVisitorId(req);

        if (!name) return res.status(400).json({ message: "Project name is required." });

        const result = await pool.query(
            "UPDATE projects SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND owner_id = $3 RETURNING *;",
            [name, id, ownerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to rename project." });
    }
};

const deleteProject = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const ownerId = getVisitorId(req);

        await client.query("BEGIN");

        const owned = await client.query(
            "SELECT id FROM projects WHERE id = $1 AND owner_id = $2;",
            [id, ownerId]
        );

        if (owned.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Project not found." });
        }

        await client.query("DELETE FROM workbooks WHERE project_id = $1;", [id]);
        const result = await client.query("DELETE FROM projects WHERE id = $1 RETURNING id;", [id]);

        await client.query("COMMIT");
        res.status(204).send();
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ message: "Failed to delete project." });
    } finally {
        client.release();
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    renameProject,
    deleteProject
};
