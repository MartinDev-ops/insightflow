/** Returns the current Univer state, including unsaved cell edits. */
export function getActiveWorkbookSnapshot(univerAPI) {
    const workbook = univerAPI?.getActiveWorkbook?.();

    return workbook?.save?.() ?? null;
}
