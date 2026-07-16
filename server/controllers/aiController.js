const { executeQuery } = require("../services/queryExecutor");

const aiQuery = async (req, res) => {

    try {

        const { workbook, query } = req.body;

        const result = executeQuery(workbook, query);

        res.json({

            workbook: result

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "AI query failed."

        });

    }

};

module.exports = {

    aiQuery

};