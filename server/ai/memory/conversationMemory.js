const memory = {

    workbook: null,

    workbookContext: null,

    entity: null,

    schema: null,

    currentSheet: null,

    selectedRows: [],

    lastFilter: null,

    lastSort: null,

    lastAggregation: null,

    lastChart: null,

    lastQuestion: null,

    lastAnswer: null,

    conversation: []

};


function updateMemory(data) {

    Object.assign(memory, data);

}


function getMemory() {

    return memory;

}


function getConversation() {

    return memory.conversation;

}


function addMessage({

    question,

    response

}) {

    memory.conversation.push({

        question,

        response,

        timestamp:
            new Date().toISOString()

    });

    memory.lastQuestion =
        question;

    memory.lastAnswer =
        response;

}


function clearMemory() {

    memory.workbook = null;

    memory.workbookContext = null;

    memory.entity = null;

    memory.schema = null;

    memory.currentSheet = null;

    memory.selectedRows = [];

    memory.lastFilter = null;

    memory.lastSort = null;

    memory.lastAggregation = null;

    memory.lastChart = null;

    memory.lastQuestion = null;

    memory.lastAnswer = null;

    memory.conversation = [];

}


module.exports = {

    updateMemory,

    getMemory,

    getConversation,

    addMessage,

    clearMemory

};