const {
    cleanWorkbookData
} = require("../services/cleaningEngine");

const cleanWorkbook = async (req, res) => {

    try {

        const { workbook } = req.body;

        if (!workbook) {

            return res.status(400).json({

                message: "Workbook required."

            });

        }

        const result = cleanWorkbookData(workbook);

        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    cleanWorkbook

};