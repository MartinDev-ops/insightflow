function FilteredTableView({ result }) {

    const headers = result?.headers || [];
    const rows = result?.rows || [];

    return (
        <div
            aria-label="Filtered spreadsheet result"
            style={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                overflow: "auto",
                background: "#fff",
                padding: 16,
                boxSizing: "border-box"
            }}
        >
            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    maxWidth: "100%",
                    fontFamily: "Arial, sans-serif"
                }}
            >
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={`${header}-${index}`}
                                style={{
                                    padding: "10px 12px",
                                    textAlign: "left",
                                    background: "#f4f6f8",
                                    border: "1px solid #d9dde3",
                                    fontWeight: 700
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((_, columnIndex) => (
                                <td
                                    key={columnIndex}
                                    style={{
                                        padding: "10px 12px",
                                        border: "1px solid #e2e5e9"
                                    }}
                                >
                                    {row.cells?.[columnIndex]?.value ?? ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p style={{ margin: "16px 0 0" }}>
                    No matching rows found.
                </p>
            )}
        </div>
    );
}

export default FilteredTableView;
