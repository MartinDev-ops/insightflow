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

    lastAnswer: null

};

function updateMemory(data) {

    Object.assign(memory, data);

}

function getMemory() {

    return memory;

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

}

module.exports = {

    updateMemory,

    getMemory,

    clearMemory

};