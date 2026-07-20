import { useEffect, useRef } from "react";

import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";

import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";

import { importExcelToUniver } from "../../import/ExcelImporter";

import "@univerjs/preset-sheets-core/lib/index.css";

function SpreadsheetView({
    onReady,
    importedWorkbook,
    onWorkbookChange,
    univerRef
}) {

    const containerRef = useRef(null);
    const univerAPIRef = useRef(null);
    const initializedRef = useRef(false);

    useEffect(() => {

        if (initializedRef.current) return;

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

        // Make Univer available to parent components
        if (univerRef) {

            univerRef.current = univerAPI;

        }

        univerAPI.createWorkbook({});

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

        const resizeObserver = new ResizeObserver(() => {

            window.dispatchEvent(new Event("resize"));

        });

        if (containerRef.current) {

            resizeObserver.observe(containerRef.current);

        }

        return () => {

            resizeObserver.disconnect();

            univerAPI.dispose();

        };

    }, []);

    useEffect(() => {

        if (!univerAPIRef.current) return;
        if (!importedWorkbook) return;

        if (importedWorkbook.sheets && importedWorkbook.sheetOrder) {

            console.log("Reloading workbook...");

            const currentWorkbook =
                univerAPIRef.current.getActiveWorkbook();

            if (currentWorkbook) {

                try {

                    univerAPIRef.current.disposeUnit(
                        currentWorkbook.getId()
                    );

                }

                catch (e) {

                    console.log(e);

                }

            }

            univerAPIRef.current.createWorkbook(importedWorkbook);

            console.log("✅ Workbook loaded.");

            return;

        }

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
                flex: 1,
                width: "100%",
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                background: "#ffffff",
                borderRadius: 8,
                overflow: "hidden"
            }}
        />

    );

}

export default SpreadsheetView;