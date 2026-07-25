function normalizeCell(cell) {
    if (cell && cell.value !== undefined) {
        return { value: cell.value };
    }

    return { value: cell?.v ?? "" };
}

function normalizeLegacyWorkbook(workbook) {
    return workbook.map(sheet => ({
        ...sheet,
        rows: (sheet.rows || []).map(row => ({
            ...row,
            cells: (row.cells || []).map(normalizeCell)
        }))
    }));
}

function normalizeUniverSheet(sheet, sheetId) {

    if (!sheet) {
        return null;
    }

    const cellData = sheet.cellData || {};
    const rowIndexes = Object.keys(cellData).map(Number).filter(Number.isInteger);
    const lastRowIndex = Math.max(...rowIndexes, -1);
    const rows = [];

    for (let rowIndex = 0; rowIndex <= lastRowIndex; rowIndex++) {
        const sourceRow = cellData[rowIndex] || {};
        const columnIndexes = Object.keys(sourceRow).map(Number).filter(Number.isInteger);
        const lastColumnIndex = Math.max(...columnIndexes, -1);
        const cells = [];

        for (let columnIndex = 0; columnIndex <= lastColumnIndex; columnIndex++) {
            cells.push(normalizeCell(sourceRow[columnIndex]));
        }

        rows.push({ cells });
    }

    return {
        name: sheet.name || sheetId,
        rows
    };
}

// Excel imports use rows/cells; saved workbooks use Univer's sheets/cellData.
// The AI engine consumes this single, consistent rows/cells shape.
function normalizeWorkbook(workbook) {
    if (Array.isArray(workbook)) {
        return normalizeLegacyWorkbook(workbook);
    }

    if (!workbook?.sheets) {
        return [];
    }

    const sheetIds = workbook.sheetOrder?.length
        ? workbook.sheetOrder
        : Object.keys(workbook.sheets);

    return sheetIds
        .map(sheetId => normalizeUniverSheet(workbook.sheets[sheetId], sheetId))
        .filter(Boolean);
}

module.exports = { normalizeWorkbook };
