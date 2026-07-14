import { useEffect, useRef } from "react";

import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";

import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";

import { convertWorkbookToUniver } from "../../utils/univerConverter";

import "@univerjs/preset-sheets-core/lib/index.css";

function SpreadsheetView({ onReady, importedWorkbook }) {

    const containerRef = useRef(null);
    const univerAPIRef = useRef(null);

    useEffect(() => {

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

        univerAPI.createWorkbook({});

        univerAPIRef.current = univerAPI;

        if (onReady) {

            onReady(univerAPI);

        }

        return () => {

            univerAPI.dispose();

        };

    }, [onReady]);

    useEffect(() => {

        if (!importedWorkbook) {

            return;

        }

        if (!univerAPIRef.current) {

            return;

        }

        console.log("Workbook received:");
        console.log(importedWorkbook);

        const workbookData = convertWorkbookToUniver(importedWorkbook);

        console.log("Converted Workbook:");
        console.log(workbookData);

        try {

            univerAPIRef.current.createWorkbook(workbookData);

            console.log("✅ Workbook loaded into Univer");

        } catch (error) {

            console.error("Failed to load workbook:", error);

        }

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