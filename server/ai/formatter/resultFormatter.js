function formatResult(result) {

    return {

        success: result.success ?? true,

        type: result.type ?? "message",

        title: result.title ?? "",

        message: result.message ?? "",

        headers: result.headers ?? [],

        rows: result.rows ?? [],

        workbook: result.workbook ?? null,

        chart: result.chart ?? null,

        metadata: result.metadata ?? {}

    };

}

module.exports = {

    formatResult

};