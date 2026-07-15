import { convertWorkbookToUniver } from "../utils/univerConverter";

class WorkbookManager {

    constructor() {

        this.univerAPI = null;
        this.currentWorkbook = null;

    }

    // -------------------------
    // Register Univer
    // -------------------------

    setUniverAPI(univerAPI) {

        this.univerAPI = univerAPI;

    }

    // -------------------------
    // Blank Workbook
    // -------------------------

    createBlankWorkbook() {

        if (!this.univerAPI) {

            throw new Error("Univer API has not been initialized.");

        }

        this.currentWorkbook = {};

        this.univerAPI.createWorkbook({});

        console.log("✅ Blank workbook created.");

    }

    // -------------------------
    // Load Workbook
    // -------------------------

    loadWorkbook(workbook) {

        if (!this.univerAPI) {

            throw new Error("Univer API has not been initialized.");

        }

        // Native Univer snapshot
        if (workbook.sheets && workbook.sheetOrder) {

            this.currentWorkbook = workbook;

            this.univerAPI.createWorkbook(workbook);

            console.log("✅ Native Univer workbook loaded.");

            return;

        }

        // ExcelJS workbook
        const univerWorkbook = convertWorkbookToUniver(workbook);

        this.currentWorkbook = univerWorkbook;

        this.univerAPI.createWorkbook(univerWorkbook);

        console.log("✅ Excel workbook converted and loaded.");

    }

    // -------------------------
    // Active Workbook
    // -------------------------

    getWorkbook() {

        if (!this.univerAPI) {

            return null;

        }

        return this.univerAPI.getActiveWorkbook();

    }

    // -------------------------
    // Export Snapshot
    // -------------------------

    exportSnapshot() {

        const workbook = this.getWorkbook();

        if (!workbook) {

            throw new Error("No active workbook.");

        }

        console.log("========== ACTIVE WORKBOOK ==========");
        console.log(workbook);

        console.log("========== WORKBOOK METHODS ==========");
        console.log(
            Object.getOwnPropertyNames(
                Object.getPrototypeOf(workbook)
            )
        );

        return workbook.save();

    }

}

const workbookManager = new WorkbookManager();

export default workbookManager;