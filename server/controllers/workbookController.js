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

            return res.status(200).json({
                workbook_data: [
                    {
                        name: "Sheet1",
                        celldata: []
                    }
                ]
            });

        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("Get Workbook Error:", error);

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

        const existingWorkbook = await pool.query(
            `
            SELECT id
            FROM workbooks
            WHERE project_id = $1;
            `,
            [projectId]
        );

        let result;

        if (existingWorkbook.rows.length === 0) {

            result = await pool.query(
                `
                INSERT INTO workbooks
                (project_id, workbook_data)
                VALUES ($1, $2)
                RETURNING *;
                `,
                [projectId, workbook_data]
            );

        } else {

            result = await pool.query(
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

        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("Save Workbook Error:", error);

        res.status(500).json({
            message: "Failed to save workbook."
        });

    }

};

module.exports = {
    getWorkbook,
    saveWorkbook
};