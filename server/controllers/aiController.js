const { buildWorkbookContext } = require("../ai/brain/contextBuilder");
const { detectWorkbookEntity } = require("../ai/brain/schemaDetector");
const { validateIntent } = require("../ai/brain/intentValidator");
const { buildPrompt } = require("../ai/brain/promptBuilder");

const { askGemini } = require("../ai/gemini/geminiClient");

const { translate } = require("../ai/translator/jsonTranslator");

const { resolveColumns } = require("../ai/semantic/resolveColumns");

const executeIntent = require("../ai/executor/workbookExecutor");

const conversationMemory = require("../ai/memory/conversationMemory");

async function askAI(req, res) {

    try {

        const {

            workbook,
            question

        } = req.body;

        // ---------------------------------
        // Conversation Memory
        // ---------------------------------

        const memory =
            conversationMemory.getConversation();

        // ---------------------------------
        // Workbook Context
        // ---------------------------------

        const workbookContext =
            buildWorkbookContext(workbook);

        // ---------------------------------
        // Detect Workbook Schema
        // ---------------------------------

        const entity =
            detectWorkbookEntity(workbookContext);

        // ---------------------------------
        // Build Prompt
        // ---------------------------------

        const prompt =
            buildPrompt({

                question,

                workbookContext,

                schema: entity,

                memory

            });

        // ---------------------------------
        // Ask Gemini
        // ---------------------------------

        const response =
            await askGemini(prompt);

        // ---------------------------------
        // Translate Gemini JSON
        // ---------------------------------

        const aiResponse =
            translate(response);

        // ---------------------------------
        // Resolve Semantic Column Names
        // ---------------------------------

        const resolvedResponse =
            resolveColumns(
                workbook,
                aiResponse
            );

        // ---------------------------------
        // Validate Intent
        // ---------------------------------

        const validation =
            validateIntent(resolvedResponse);

        if (!validation.valid) {

            return res.json({

                success: false,

                message: validation.message

            });

        }

        // ---------------------------------
        // Execute Intent
        // ---------------------------------

        const result =
            await executeIntent(
                workbook,
                resolvedResponse
            );

        // ---------------------------------
        // Save Conversation
        // ---------------------------------

        conversationMemory.addMessage({

            question,

            response: resolvedResponse

        });

        // ---------------------------------
        // Return Result
        // ---------------------------------

        return res.json({

            success: true,

            result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

module.exports = {

    askAI

};