import { LocaleType } from "@univerjs/presets";

export function convertWorkbookToUniver(workbook) {

    const sheets = {};
    const sheetOrder = [];

    workbook.forEach((sheet, sheetIndex) => {

        const sheetId = `sheet-${sheetIndex + 1}`;

        sheetOrder.push(sheetId);

        const cellData = {};
        const rowData = {};
        const columnData = {};

        // -------------------------
        // Rows
        // -------------------------

        (sheet.rows || []).forEach((row, rowIndex) => {

            cellData[rowIndex] = {};

            rowData[rowIndex] = {

                h: row.height || 23

            };

            (row.cells || []).forEach((cell, columnIndex) => {

                cellData[rowIndex][columnIndex] = {

                    v: cell?.value ?? ""

                };

            });

        });

        // -------------------------
        // Columns
        // -------------------------

        (sheet.columns || []).forEach((column, columnIndex) => {

            columnData[columnIndex] = {

                w: (column.width || 10) * 8

            };

        });

        // -------------------------
        // Merge Data
        // -------------------------

        const mergeData = [];

        (sheet.merges || []).forEach((merge) => {

            mergeData.push({

                range: merge

            });

        });

        // -------------------------
        // Sheet
        // -------------------------

        sheets[sheetId] = {

            id: sheetId,

            name: sheet.name || `Sheet ${sheetIndex + 1}`,

            rowCount: Math.max(sheet.rowCount || 100, 100),

            columnCount: Math.max(sheet.columnCount || 26, 26),

            cellData,

            rowData,

            columnData,

            mergeData,

            hidden: 0,

            zoomRatio: 1,

            scrollTop: 0,

            scrollLeft: 0,

            defaultColumnWidth: 73,

            defaultRowHeight: 23,

            freeze: {

                startRow: -1,

                startColumn: -1,

                xSplit: 0,

                ySplit: 0

            }

        };

    });

    return {

        id: "workbook",

        name: "Workbook",

        appVersion: "0.25.1",

        locale: LocaleType.EN_US,

        styles: {},

        sheetOrder,

        sheets

    };

}