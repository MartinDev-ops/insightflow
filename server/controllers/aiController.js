const {
    buildWorkbookContext
} = require("../ai/brain/contextBuilder");

const {
    validateIntent
} = require("../ai/brain/intentValidator");

const {
    buildPrompt
} = require("../ai/brain/promptBuilder");

const {
    askGemini
} = require("../ai/gemini/geminiClient");

const {
    translate
} = require("../ai/translator/jsonTranslator");

const {
    resolveColumns
} = require("../ai/semantic/resolveColumns");

const executeIntent =
    require("../ai/executor/workbookExecutor");

const conversationMemory =
    require("../ai/memory/conversationMemory");

const {
    classifyQuestion
} = require("../ai/planner/planner");

const pool = require("../config/db");

const {
    normalizeWorkbook
} = require("../ai/workbook/normalizeWorkbook");

const { getVisitorId } = require("../utils/visitor");


async function getSavedWorkbook(projectId, ownerId) {

    if (!projectId || !ownerId) {

        return null;

    }

    const result = await pool.query(

        `
        SELECT w.workbook_data
        FROM workbooks w
        JOIN projects p ON p.id = w.project_id
        WHERE w.project_id = $1 AND p.owner_id = $2
        `,
        [projectId, ownerId]

    );

    return result.rows[0]?.workbook_data || null;

}


async function askAI(req, res) {

    try {

        const {

            workbook,

            projectId,

            question

        } = req.body;

        const ownerId = getVisitorId(req);


        // A live workbook lets the assistant read an import before it is
        // saved. If none was sent, recover the saved workbook for this project.
        const sourceWorkbook =

            workbook

            ||

            await getSavedWorkbook(projectId, ownerId);

        // Preserve the original import format exactly. Only saved Univer
        // snapshots need conversion before they reach the existing AI engine.
        const aiWorkbook =

            Array.isArray(sourceWorkbook)

                ? sourceWorkbook

                : normalizeWorkbook(sourceWorkbook);


        //---------------------------------
        // Planner
        //---------------------------------

        const requestType =
            classifyQuestion(question);


        //---------------------------------
        // Conversation Memory
        //---------------------------------

        const memory =
            conversationMemory
                .getConversation();


        //---------------------------------
        // Workbook Context
        //---------------------------------

        const workbookContext =

            requestType === "general"

                ? null

                : buildWorkbookContext(

                    aiWorkbook

                );


        //---------------------------------
        // Build Prompt
        //---------------------------------

        const prompt =
            buildPrompt({

                question,

                workbookContext,

                schema: workbookContext,

                memory,

                requestType

            });


        //---------------------------------
        // Ask Gemini
        //---------------------------------

        const response =
            await askGemini(

                prompt

            );


        //---------------------------------
        // Translate Gemini JSON
        //---------------------------------

        const aiResponse =
            translate(

                response

            );


        //---------------------------------
        // Resolve Semantic Columns
        //---------------------------------

        const resolvedResponse =
            resolveColumns(

                aiWorkbook,

                aiResponse

            );


        //---------------------------------
        // Validate Intent
        //---------------------------------

        const validation =
            validateIntent(

                resolvedResponse

            );


        if (!validation.valid) {

            return res.json({

                success: false,

                message:
                    validation.reason

            });

        }


        //---------------------------------
        // Execute Intent
        //---------------------------------

        const result =
            await executeIntent(

                aiWorkbook,

                resolvedResponse

            );


        //---------------------------------
        // Save Conversation
        //---------------------------------

        conversationMemory.addMessage({

            question,

            response:
                resolvedResponse

        });


        //---------------------------------
        // Return Result
        //---------------------------------

        return res.json({

            success: true,

            result,

            requestType

        });

    }


    catch (error) {

        console.error(error);


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

}


module.exports = {

    askAI

};
