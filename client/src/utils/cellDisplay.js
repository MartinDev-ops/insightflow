export function displayCellValue(cellOrValue) {
    const value = cellOrValue?.value ?? cellOrValue?.v ?? cellOrValue ?? "";

    if (value === null || value === undefined) return "";
    if (typeof value !== "object") return String(value);

    const calculatedValue = value.result ?? value.cachedValue ?? value.v;

    if (calculatedValue !== undefined && calculatedValue !== null && typeof calculatedValue !== "object") {
        return String(calculatedValue);
    }

    if (typeof value.formula === "string") {
        return value.formula.startsWith("=") ? value.formula : `=${value.formula}`;
    }

    return "";
}
