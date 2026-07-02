const pool = require("../config/db");

// Get workbook by project ID
const getWorkbook = async (req, res) => {

    try {

        const { projectId } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM workbooks
            WHERE project_id = $1;
            `,
            [projectId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Workbook not found."
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load workbook."
        });

    }

};

// Save workbook
const saveWorkbook = async (req, res) => {

    try {

        const { projectId } = req.params;

        const { workbook_data } = req.body;

        const result = await pool.query(
            `
            UPDATE workbooks
            SET
                workbook_data = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE project_id = $2
            RETURNING *;
            `,
            [workbook_data, projectId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Workbook not found."
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to save workbook."
        });

    }

};

module.exports = {

    getWorkbook,
    saveWorkbook

};