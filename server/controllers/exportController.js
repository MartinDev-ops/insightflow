const ExcelJS = require("exceljs");
const pool = require("../config/db");

const exportWorkbook = async (req, res) => {

    try {

        const { projectId } = req.params;

        const result = await pool.query(

            `
            SELECT workbook_data
            FROM workbooks
            WHERE project_id = $1
            `,
            [projectId]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                message: "Workbook not found."

            });

        }

        const workbookData = result.rows[0].workbook_data;

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Sheet1");

        // Temporary export (we'll improve this later)
        worksheet.getCell("A1").value =
            JSON.stringify(workbookData, null, 2);

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            `attachment; filename=Project-${projectId}.xlsx`

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to export workbook."

        });

    }

};

module.exports = {

    exportWorkbook

};