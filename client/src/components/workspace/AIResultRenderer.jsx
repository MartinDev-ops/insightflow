function AIResultRenderer({ result }) {

    if (!result) return null;

    switch (result.type) {

        case "message":

            return (

                <div
                    style={{
                        padding: 12,
                        background: "#ffffff",
                        borderRadius: 8,
                        border: "1px solid #ddd"
                    }}
                >
                    {result.message}
                </div>

            );

        case "aggregate":

            return (

                <div
                    style={{
                        padding: 12,
                        background: "#ffffff",
                        borderRadius: 8,
                        border: "1px solid #ddd"
                    }}
                >

                    <strong>{result.message}</strong>

                    <h2
                        style={{
                            marginTop: 10,
                            marginBottom: 0
                        }}
                    >
                        {result.value}
                    </h2>

                </div>

            );

        case "table":

            return (

                <div
                    style={{
                        overflowX: "auto",
                        border: "1px solid #ddd",
                        borderRadius: 8
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                {result.headers?.map(header => (

                                    <th
                                        key={header}
                                        style={{
                                            borderBottom: "1px solid #ddd",
                                            padding: 8,
                                            textAlign: "left",
                                            background: "#f6f6f6"
                                        }}
                                    >
                                        {header}
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody>

                            {result.rows?.map((row, index) => (

                                <tr key={index}>

                                    {row.cells.map((cell, i) => (

                                        <td
                                            key={i}
                                            style={{
                                                padding: 8,
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            {cell.value}
                                        </td>

                                    ))}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            );

        default:

            return null;

    }

}

export default AIResultRenderer;