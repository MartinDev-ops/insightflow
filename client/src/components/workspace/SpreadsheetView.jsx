import { useEffect, useRef } from "react";

import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";

import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";

import { importExcelToUniver } from "../../import/ExcelImporter";

import "@univerjs/preset-sheets-core/lib/index.css";

function SpreadsheetView({
    onReady,
    importedWorkbook,
    onWorkbookChange
}) {

    const containerRef = useRef(null);

    const univerAPIRef = useRef(null);

    const initializedRef = useRef(false);

    const workbookLoadedRef = useRef(false);

    useEffect(() => {

        if (initializedRef.current) {

            return;

        }

        initializedRef.current = true;

        const { univerAPI } = createUniver({

            locale: LocaleType.EN_US,

            locales: {

                [LocaleType.EN_US]: mergeLocales(
                    UniverPresetSheetsCoreEnUS
                )

            },

            presets: [

                UniverSheetsCorePreset({

                    container: containerRef.current

                })

            ]

        });

        univerAPIRef.current = univerAPI;

        console.log("========== UNIVER API ==========");
        console.log(
            Object.getOwnPropertyNames(
                Object.getPrototypeOf(univerAPI)
            )
        );

        // Create ONE blank workbook
        univerAPI.createWorkbook({});

        // --------------------------
        // Notify parent when workbook changes
        // --------------------------

        const workbook = univerAPI.getActiveWorkbook();

        if (workbook && onWorkbookChange) {

            workbook.onCommandExecuted(() => {

                onWorkbookChange();

            });

        }

        if (onReady) {

            onReady(univerAPI);

        }

        console.log("✅ Univer initialized.");

        return () => {

            univerAPI.dispose();

        };

    }, []);

    useEffect(() => {

        if (!univerAPIRef.current) {

            return;

        }

        if (!importedWorkbook) {

            return;

        }

        // ---------------------------------------
        // Load saved Univer workbook
        // ---------------------------------------

        if (importedWorkbook.sheets && importedWorkbook.sheetOrder) {

            if (workbookLoadedRef.current) {

                return;

            }

            workbookLoadedRef.current = true;

            console.log("Loading saved Univer workbook...");

            const currentWorkbook =
                univerAPIRef.current.getActiveWorkbook();

            if (currentWorkbook) {

                console.log(
                    "Disposing workbook:",
                    currentWorkbook.getId()
                );

                univerAPIRef.current.disposeUnit(
                    currentWorkbook.getId()
                );

            }

            console.log("Creating saved workbook...");

            univerAPIRef.current.createWorkbook(
                importedWorkbook
            );

            console.log("✅ Saved workbook restored.");

            return;

        }

        // ---------------------------------------
        // Excel Import
        // ---------------------------------------

        console.log("Importing Excel workbook...");

        importExcelToUniver(
            univerAPIRef.current,
            importedWorkbook
        );

    }, [importedWorkbook]);

    return (

        <div

            ref={containerRef}

            style={{

                width: "100%",

                height: "700px"

            }}

        />

    );

}

export default SpreadsheetView;