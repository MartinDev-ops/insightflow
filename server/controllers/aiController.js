const { buildWorkbookContext } = require("../ai/brain/contextBuilder");
const { detectWorkbookEntity } = require("../ai/brain/schemaDetector");
const { validateIntent } = require("../ai/brain/intentValidator");
const { buildPrompt } = require("../ai/brain/promptBuilder");

const { askGemini } = require("../ai/gemini/geminiClient");

const { translate } = require("../ai/translator/jsonTranslator");

const { resolveColumns } = require("../ai/semantic/resolveColumns");

const executeIntent = require("../ai/executor/workbookExecutor");

const editorEngine = require("../ai/editor/editorEngine");

const { formatResult } = require("../ai/formatter/resultFormatter");

const conversationMemory = require("../ai/memory/conversationMemory");

const { classifyQuestion } = require("../ai/planner/planner");

async function askAI(req, res) {

    try {

        const {

            workbook,
            question

        } = req.body;

        //---------------------------------
        // Planner
        //---------------------------------

        const requestType =
            classifyQuestion(question);

        //---------------------------------
        // Conversation Memory
        //---------------------------------

        const memory =
            conversationMemory.getConversation();

        //---------------------------------
        // Workbook Context
        //---------------------------------

        const workbookContext =

            requestType === "general"

                ? null

                : buildWorkbookContext(workbook);

        //---------------------------------
        // Detect Workbook Entity
        //---------------------------------

        const entity =

            workbookContext

                ? detectWorkbookEntity(workbookContext)

                : null;

        //---------------------------------
        // Prompt
        //---------------------------------

        const prompt =
            buildPrompt({

                question,

                workbookContext,

                schema: entity,

                memory,

                requestType

            });

        //---------------------------------
        // Gemini
        //---------------------------------

        const response =
            await askGemini(prompt);

        //---------------------------------
        // Translate
        //---------------------------------

        const aiResponse =
            translate(response);

        //---------------------------------
        // Resolve Semantic Columns
        //---------------------------------

        const resolvedResponse =
            resolveColumns(

                workbook,

                aiResponse

            );

        //---------------------------------
        // Validate
        //---------------------------------

        const validation =
            validateIntent(

                resolvedResponse

            );

        if (!validation.valid) {

            return res.json({

                success: false,

                message: validation.message

            });

        }

        //---------------------------------
        // Execute
        //---------------------------------

        let result;

        if (

            resolvedResponse.route === "edit"

        ) {

            result =
                await editorEngine(

                    workbook,

                    resolvedResponse

                );

        }

        else {

            result =
                await executeIntent(

                    workbook,

                    resolvedResponse

                );

        }

        //---------------------------------
        // Format Result
        //---------------------------------

        const formattedResult =
            formatResult(result);

        //---------------------------------
        // Save Conversation
        //---------------------------------

        conversationMemory.addMessage({

            question,

            response: resolvedResponse

        });

        //---------------------------------
        // Response
        //---------------------------------

        return res.json({

            success: true,

            result: formattedResult,

            requestType

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