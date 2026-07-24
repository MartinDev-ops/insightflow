import { LocaleType } from "@univerjs/presets";


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


export function convertWorkbookToUniver(

    workbook

) {


    const sheets = {};

    const sheetOrder = [];


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


                            cellData[

                                rowIndex

                            ][

                                columnIndex

                            ] = {


                                v:

                                    cell?.value ??

                                    ""

                            };

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

            {},


        sheetOrder,


        sheets

    };

}