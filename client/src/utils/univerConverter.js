import { LocaleType } from "@univerjs/presets";

import {
    BooleanNumber,
    BorderStyleTypes,
    HorizontalAlign,
    VerticalAlign,
    WrapStrategy
} from "@univerjs/core";


function calculateColumnWidth(

    sheet,

    columnIndex

) {

    const MIN_WIDTH = 90;

    const MAX_WIDTH = 300;

    const CHARACTER_WIDTH = 8;


    let longestTextLength = 0;


    //--------------------------------
    // Check header and all data
    //--------------------------------

    (sheet.rows || []).forEach(row => {


        const cell =

            row.cells?.[columnIndex];


        if (

            cell?.value !== undefined &&

            cell?.value !== null

        ) {


            const text =

                String(cell.value);


            longestTextLength =

                Math.max(

                    longestTextLength,

                    text.length

                );

        }

    });


    //--------------------------------
    // Calculate width
    //--------------------------------

    let width =

        longestTextLength *

        CHARACTER_WIDTH;


    //--------------------------------
    // Minimum width
    //--------------------------------

    width = Math.max(

        width,

        MIN_WIDTH

    );


    //--------------------------------
    // Maximum width
    //--------------------------------

    width = Math.min(

        width,

        MAX_WIDTH

    );


    return width;

}


//--------------------------------
// Style conversion (ExcelJS -> Univer IStyleData)
//--------------------------------

const BORDER_STYLE_MAP = {
    thin: BorderStyleTypes.THIN,
    hair: BorderStyleTypes.HAIR,
    dotted: BorderStyleTypes.DOTTED,
    dashed: BorderStyleTypes.DASHED,
    dashDot: BorderStyleTypes.DASH_DOT,
    dashDotDot: BorderStyleTypes.DASH_DOT_DOT,
    double: BorderStyleTypes.DOUBLE,
    medium: BorderStyleTypes.MEDIUM,
    mediumDashed: BorderStyleTypes.MEDIUM_DASHED,
    mediumDashDot: BorderStyleTypes.MEDIUM_DASH_DOT,
    mediumDashDotDot: BorderStyleTypes.MEDIUM_DASH_DOT_DOT,
    slantDashDot: BorderStyleTypes.SLANT_DASH_DOT,
    thick: BorderStyleTypes.THICK
};

const H_ALIGN_MAP = {
    left: HorizontalAlign.LEFT,
    center: HorizontalAlign.CENTER,
    centerContinuous: HorizontalAlign.CENTER,
    right: HorizontalAlign.RIGHT,
    justify: HorizontalAlign.JUSTIFIED,
    distributed: HorizontalAlign.DISTRIBUTED
};

const V_ALIGN_MAP = {
    top: VerticalAlign.TOP,
    middle: VerticalAlign.MIDDLE,
    bottom: VerticalAlign.BOTTOM,
    distributed: VerticalAlign.MIDDLE,
    justify: VerticalAlign.MIDDLE
};

// ExcelJS reports colors as ARGB hex ("FFRRGGBB") or a theme index.
// Theme colors need the workbook's theme XML to resolve correctly, which
// ExcelJS doesn't expose, so cells that only carry a theme color fall
// back to no explicit color instead of guessing wrong.
function convertColor(color) {

    if (!color?.argb) {

        return undefined;

    }

    const hex =

        color.argb.length === 8
            ? color.argb.slice(2)
            : color.argb;

    return {
        rgb: `#${hex}`
    };

}


function convertFont(font) {

    if (!font) {

        return {};

    }

    const style = {};

    if (font.name) {

        style.ff = font.name;

    }

    if (font.size) {

        style.fs = font.size;

    }

    if (font.bold) {

        style.bl = BooleanNumber.TRUE;

    }

    if (font.italic) {

        style.it = BooleanNumber.TRUE;

    }

    if (font.underline) {

        style.ul = { s: BooleanNumber.TRUE };

    }

    if (font.strike) {

        style.st = { s: BooleanNumber.TRUE };

    }

    const color = convertColor(font.color);

    if (color) {

        style.cl = color;

    }

    return style;

}


// Solid fills show their foreground color as the visible cell background;
// bgColor is only the pattern's secondary color for non-solid patterns, so
// fgColor is the closest single-color approximation for those too.
function convertFill(fill) {

    if (!fill || fill.type !== "pattern") {

        return undefined;

    }

    if (!fill.pattern || fill.pattern === "none") {

        return undefined;

    }

    return convertColor(fill.fgColor);

}


function convertBorderSide(side) {

    if (!side?.style) {

        return undefined;

    }

    return {
        s: BORDER_STYLE_MAP[side.style] ?? BorderStyleTypes.THIN,
        cl: convertColor(side.color) || { rgb: "#000000" }
    };

}


function convertBorder(border) {

    if (!border) {

        return undefined;

    }

    const bd = {};

    const top = convertBorderSide(border.top);
    const bottom = convertBorderSide(border.bottom);
    const left = convertBorderSide(border.left);
    const right = convertBorderSide(border.right);

    if (top) bd.t = top;
    if (bottom) bd.b = bottom;
    if (left) bd.l = left;
    if (right) bd.r = right;

    return Object.keys(bd).length ? bd : undefined;

}


function convertAlignment(alignment) {

    if (!alignment) {

        return {};

    }

    const style = {};

    if (alignment.horizontal && H_ALIGN_MAP[alignment.horizontal] !== undefined) {

        style.ht = H_ALIGN_MAP[alignment.horizontal];

    }

    if (alignment.vertical && V_ALIGN_MAP[alignment.vertical] !== undefined) {

        style.vt = V_ALIGN_MAP[alignment.vertical];

    }

    if (alignment.wrapText) {

        style.tb = WrapStrategy.WRAP;

    }

    return style;

}


function convertNumFmt(numFmt) {

    if (!numFmt || numFmt === "General") {

        return {};

    }

    return {
        n: { pattern: numFmt }
    };

}


// Builds an IStyleData object from a raw ExcelJS cell, or null if the cell
// carries no styling at all (so plain, unstyled cells stay unstyled instead
// of picking up an empty style object).
function buildCellStyle(cell) {

    const style = {

        ...convertFont(cell.font),

        ...convertAlignment(cell.alignment),

        ...convertNumFmt(cell.numFmt)

    };

    const bg = convertFill(cell.fill);

    if (bg) {

        style.bg = bg;

    }

    const bd = convertBorder(cell.border);

    if (bd) {

        style.bd = bd;

    }

    return Object.keys(style).length ? style : null;

}


// Dedupes identical style objects into shared entries, the same way Excel
// itself keeps one style pool referenced by many cells, instead of writing
// out a full style object per cell.
function createStylePool() {

    const styles = {};

    const cache = new Map();

    let counter = 0;

    function register(styleData) {

        if (!styleData) {

            return undefined;

        }

        const key = JSON.stringify(styleData);

        if (cache.has(key)) {

            return cache.get(key);

        }

        const id = `style-${++counter}`;

        styles[id] = styleData;

        cache.set(key, id);

        return id;

    }

    return { styles, register };

}


export function convertWorkbookToUniver(

    workbook

) {


    const sheets = {};

    const sheetOrder = [];

    const stylePool = createStylePool();


    workbook.forEach(

        (

            sheet,

            sheetIndex

        ) => {


            const sheetId =

                `sheet-${sheetIndex + 1}`;


            sheetOrder.push(

                sheetId

            );


            const cellData = {};

            const rowData = {};

            const columnData = {};


            //--------------------------------
            // Rows
            //--------------------------------

            (

                sheet.rows ||

                []

            ).forEach(

                (

                    row,

                    rowIndex

                ) => {


                    cellData[rowIndex] = {};


                    rowData[rowIndex] = {


                        h:

                            row.height ||

                            23


                    };


                    (

                        row.cells ||

                        []

                    ).forEach(

                        (

                            cell,

                            columnIndex

                        ) => {


                            const cellEntry = {

                                v:

                                    cell?.value ??

                                    ""

                            };

                            const styleId =

                                stylePool.register(

                                    buildCellStyle(cell || {})

                                );

                            if (styleId) {

                                cellEntry.s = styleId;

                            }

                            cellData[

                                rowIndex

                            ][

                                columnIndex

                            ] = cellEntry;

                        }

                    );

                }

            );


            //--------------------------------
            // Columns
            //--------------------------------

            const totalColumns =

                Math.max(

                    sheet.columnCount ||

                    0,

                    sheet.columns?.length ||

                    0,

                    26

                );


            for (

                let columnIndex = 0;

                columnIndex < totalColumns;

                columnIndex++

            ) {


                const calculatedWidth =

                    calculateColumnWidth(

                        sheet,

                        columnIndex

                    );


                const existingWidth =

                    sheet.columns?.[

                        columnIndex

                    ]?.width;


                columnData[

                    columnIndex

                ] = {


                    w:

                        existingWidth

                            ? Math.max(

                                existingWidth * 8,

                                90

                            )

                            : calculatedWidth

                };

            }


            //--------------------------------
            // Merge Data
            //--------------------------------

            const mergeData = [];


            (

                sheet.merges ||

                []

            ).forEach(

                merge => {


                    mergeData.push({


                        range:

                            merge

                    });

                }

            );


            //--------------------------------
            // Sheet
            //--------------------------------

            sheets[sheetId] = {


                id:

                    sheetId,


                name:

                    sheet.name ||

                    `Sheet ${sheetIndex + 1}`,


                rowCount:

                    Math.max(

                        sheet.rowCount ||

                        100,

                        100

                    ),


                columnCount:

                    totalColumns,


                cellData,


                rowData,


                columnData,


                mergeData,


                hidden:

                    0,


                zoomRatio:

                    1,


                scrollTop:

                    0,


                scrollLeft:

                    0,


                defaultColumnWidth:

                    90,


                defaultRowHeight:

                    23,


                freeze: {


                    startRow:

                        -1,


                    startColumn:

                        -1,


                    xSplit:

                        0,


                    ySplit:

                        0

                }

            };

        }

    );


    return {


        id:

            "workbook",


        name:

            "Workbook",


        appVersion:

            "0.25.1",


        locale:

            LocaleType.EN_US,


        styles:

            stylePool.styles,


        sheetOrder,


        sheets

    };

}
