const express = require("express");

const router = express.Router();

const { chatbotEngine } = require("../services/chatbotEngine");

router.post("/", async (req, res) => {

    try {

        const {

            workbook,
            question

        } = req.body;

        const result = chatbotEngine(

            question,
            workbook

        );

        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "AI failed."

        });

    }

});

module.exports = router;