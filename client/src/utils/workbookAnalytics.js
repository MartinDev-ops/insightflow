function cellValue(cell) {
    const value = cell?.value ?? cell?.v ?? "";
    return value === null || value === undefined ? "" : String(value).trim();
}

function workbookRows(workbook) {
    if (Array.isArray(workbook)) {
        return workbook[0]?.rows?.map((row) => (row.cells || []).map(cellValue)) || [];
    }

    const sheetId = workbook?.sheetOrder?.[0] || Object.keys(workbook?.sheets || {})[0];
    const cellData = workbook?.sheets?.[sheetId]?.cellData || {};
    const lastRow = Math.max(-1, ...Object.keys(cellData).map(Number));

    return Array.from({ length: lastRow + 1 }, (_, rowIndex) => {
        const row = cellData[rowIndex] || {};
        const lastColumn = Math.max(-1, ...Object.keys(row).map(Number));
        return Array.from({ length: lastColumn + 1 }, (_, columnIndex) => cellValue(row[columnIndex]));
    });
}

function numberValue(value) {
    const cleaned = value.replace(/[$£€,%\s,]/g, "");
    return cleaned && Number.isFinite(Number(cleaned)) ? Number(cleaned) : null;
}

function topGroups(values, maxGroups = 6) {
    const counts = new Map();
    values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const shown = ranked.slice(0, maxGroups).map(([label, value]) => ({ label, value, members: [label] }));
    const otherMembers = ranked.slice(maxGroups).map(([label]) => label);

    if (otherMembers.length) {
        shown.push({
            label: "Other",
            value: otherMembers.reduce((sum, label) => sum + counts.get(label), 0),
            members: otherMembers
        });
    }

    return shown;
}

function comparableKey(name) {
    return name.toLowerCase()
        .replace(/\b(19|20)\d{2}\b|\bq[1-4]\b|\b(actual|budget|target|forecast|previous|current|prior|ytd)\b/g, "")
        .replace(/[^a-z]/g, "");
}

function isIdentifier(name) {
    return /(^|\s|_)(id|identifier|code|number|no|phone|postal|zip)(\s|_|$)/i.test(name);
}

export function analyseWorkbook(workbook) {
    const rows = workbookRows(workbook);
    const headerIndex = rows.findIndex((row) => row.some(Boolean));

    if (headerIndex === -1) {
        return { headers: [], rows: 0, columns: 0, missing: 0, duplicates: 0, charts: [] };
    }

    const rawHeaders = rows[headerIndex];
    const columnCount = rawHeaders.length;
    const headers = rawHeaders.map((header, index) => header || `Column ${index + 1}`);
    const data = rows.slice(headerIndex + 1)
        .map((row) => Array.from({ length: columnCount }, (_, index) => row[index] || ""))
        .filter((row) => row.some(Boolean));

    if (!data.length || !columnCount) {
        return { headers, rows: 0, columns: columnCount, missing: 0, duplicates: 0, charts: [] };
    }

    const missing = data.flat().filter((value) => !value).length;
    const duplicates = data.length - new Set(data.map((row) => JSON.stringify(row))).size;
    const profiles = headers.map((name, index) => {
        const values = data.map((row) => row[index]).filter(Boolean);
        const numericValues = values.map(numberValue).filter((value) => value !== null);
        const uniqueValues = new Set(values);
        const isNumeric = values.length > 0 && numericValues.length / values.length >= 0.8 && uniqueValues.size > 1;
        const isCategory = !isNumeric && uniqueValues.size >= 2 && uniqueValues.size <= Math.min(12, data.length);

        return { name, index, values, numericValues, isNumeric, isCategory };
    });

    const category = profiles.find((profile) => profile.isCategory);
    const measures = profiles.filter((profile) => profile.isNumeric && !isIdentifier(profile.name));
    const charts = [];

    if (category) {
        const groups = topGroups(category.values);
        charts.push({
            id: "distribution",
            type: groups.length <= 5 ? "pie" : "bar",
            title: `${category.name} distribution`,
            data: groups,
            selectableTypes: ["bar", "line", "pie"]
        });

        const preferredMeasure = measures.find(({ name }) => /total|sales|revenue|amount|value|cost|profit/i.test(name)) || measures[0];
        const comparablePair = measures.flatMap((measure, index) =>
            measures.slice(index + 1).map((candidate) => [measure, candidate])
        ).find(([first, second]) =>
            comparableKey(first.name) && comparableKey(first.name) === comparableKey(second.name)
        );
        const selectedMeasures = comparablePair || (preferredMeasure ? [preferredMeasure] : []);

        if (selectedMeasures.length) {
            const series = selectedMeasures.map((profile) => ({
                label: profile.name,
                values: groups.map(({ members }) => {
                    const matching = data
                        .filter((row) => members.includes(row[category.index]))
                        .map((row) => numberValue(row[profile.index]))
                        .filter((value) => value !== null);
                    return matching.length ? matching.reduce((sum, value) => sum + value, 0) / matching.length : 0;
                })
            }));

            charts.push({
                id: "measure",
                type: series.length === 2 ? "grouped" : "bar",
                title: `Average ${series.map(({ label }) => label).join(" and ")} by ${category.name}`,
                labels: groups.map(({ label }) => label),
                series,
                selectableTypes: ["bar", "line", "pie"]
            });
        }
    } else if (measures.length) {
        charts.push({
            id: "measure-summary",
            type: "bar",
            title: "Average values by column",
            data: measures.slice(0, 6).map((profile) => ({
                label: profile.name,
                value: profile.numericValues.reduce((sum, value) => sum + value, 0) / profile.numericValues.length,
                members: [profile.name]
            })),
            selectableTypes: ["bar", "line", "pie"]
        });
    }

    return { headers, rows: data.length, columns: columnCount, missing, duplicates, charts };
}
