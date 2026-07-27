import { getActiveWorkbookSnapshot } from "./getActiveWorkbookSnapshot";

describe("getActiveWorkbookSnapshot", () => {
    it("reads the edited value from Univer rather than an earlier workbook", () => {
        const latestWorkbook = {
            sheets: { sheet1: { cellData: { 1: { 0: { v: "John" } } } } }
        };
        const univerAPI = {
            getActiveWorkbook: () => ({ save: () => latestWorkbook })
        };

        expect(getActiveWorkbookSnapshot(univerAPI)).toBe(latestWorkbook);
        expect(getActiveWorkbookSnapshot(univerAPI).sheets.sheet1.cellData[1][0].v)
            .toBe("John");
    });

    it("returns null when there is no active workbook", () => {
        expect(getActiveWorkbookSnapshot(null)).toBeNull();
    });
});
