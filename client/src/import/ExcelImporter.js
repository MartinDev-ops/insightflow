import { convertWorkbookToUniver } from "../utils/univerConverter";

export function importExcelToUniver(univerAPI, workbookData) {

    if (!univerAPI || !workbookData?.length) {

        return;

    }

    // Convert the Excel workbook into a Univer workbook
    const univerWorkbook = convertWorkbookToUniver(workbookData);

    // Remove the temporary blank workbook
    const currentWorkbook = univerAPI.getActiveWorkbook();

    if (currentWorkbook) {

        univerAPI.disposeUnit(currentWorkbook.getId());

    }

    // Create the real workbook with ALL worksheets
    univerAPI.createWorkbook(univerWorkbook);

    console.log(
        `✅ Imported ${univerWorkbook.sheetOrder.length} worksheet(s).`
    );

}