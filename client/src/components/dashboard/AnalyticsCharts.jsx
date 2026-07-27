import { useEffect, useRef, useState } from "react";

const COLORS = ["#2563EB", "#60A5FA", "#93C5FD", "#BFDBFE", "#1D4ED8", "#64748B", "#CBD5E1"];

function formatValue(value) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
}

function chartData(chart) {
    return chart.data || chart.labels.map((label, index) => ({ label, value: chart.series[0].values[index] }));
}

function BarChart({ chart }) {
    if (chart.series?.length > 1) return <GroupedBarChart chart={chart} />;

    const data = chartData(chart);
    const maximum = Math.max(...data.map(({ value }) => value), 1);
    const width = 540;
    const height = 235;
    const margin = { top: 22, right: 16, bottom: 45, left: 52 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const slotWidth = chartWidth / data.length;
    const barWidth = Math.min(42, slotWidth * 0.62);
    const y = (value) => margin.top + chartHeight - (value / maximum) * chartHeight;
    const ticks = [0, 0.25, 0.5, 0.75, 1];

    return <div className="column-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.title}>
        {ticks.map((tick) => <g key={tick}>
            <line x1={margin.left} x2={width - margin.right} y1={y(maximum * tick)} y2={y(maximum * tick)} className="line-grid" />
            <text x={margin.left - 8} y={y(maximum * tick) + 4} textAnchor="end" className="line-tick">{formatValue(maximum * tick)}</text>
        </g>)}
        {data.map(({ label, value }, index) => {
            const x = margin.left + index * slotWidth + (slotWidth - barWidth) / 2;
            const barHeight = Math.max((value / maximum) * chartHeight, 2);
            return <g key={label}>
                <title>{`${label}: ${formatValue(value)}`}</title>
                <rect x={x} y={margin.top + chartHeight - barHeight} width={barWidth} height={barHeight} rx="2" fill="#2563EB" />
                <text x={x + barWidth / 2} y={margin.top + chartHeight - barHeight - 7} textAnchor="middle" className="bar-value">{formatValue(value)}</text>
                <text x={x + barWidth / 2} y={height - 18} textAnchor="middle" className="line-label">{label.length > 13 ? `${label.slice(0, 12)}…` : label}</text>
            </g>;
        })}
    </svg></div>;
}

function PieChart({ chart }) {
    const data = chartData(chart);
    const total = data.reduce((sum, { value }) => sum + value, 0) || 1;
    let current = 0;
    const stops = data.map(({ value }, index) => {
        const start = (current / total) * 360;
        current += value;
        return `${COLORS[index % COLORS.length]} ${start}deg ${(current / total) * 360}deg`;
    }).join(", ");

    return <div className="pie-layout">
        <div className="pie-chart" style={{ background: `conic-gradient(${stops})` }}><span>{formatValue(total)}<small>total</small></span></div>
        <div className="chart-legend">{data.map(({ label, value }, index) => <div key={label}>
            <i style={{ background: COLORS[index % COLORS.length] }} /><span title={label}>{label}</span><strong>{formatValue(value)} <em>· {Math.round((value / total) * 100)}%</em></strong>
        </div>)}</div>
    </div>;
}

function GroupedBarChart({ chart }) {
    const maximum = Math.max(...chart.series.flatMap(({ values }) => values), 1);
    return <div className="grouped-chart">
        <div className="chart-key">{chart.series.map(({ label }, index) => <span key={label}><i style={{ background: COLORS[index] }} />{label}</span>)}</div>
        <div className="grouped-bars">{chart.labels.map((label, itemIndex) => <div className="group" key={label}>
            <div className="group-columns">{chart.series.map(({ label: seriesLabel, values }, seriesIndex) => <div key={seriesLabel} className="group-bar" title={`${seriesLabel}: ${formatValue(values[itemIndex])}`} style={{ height: `${Math.max((values[itemIndex] / maximum) * 100, 2)}%`, background: COLORS[seriesIndex] }} />)}</div>
            <span title={label}>{label}</span>
        </div>)}</div>
    </div>;
}

function LineChart({ chart }) {
    const labels = chart.data?.map(({ label }) => label) || chart.labels;
    const series = chart.data ? [{ label: "Value", values: chart.data.map(({ value }) => value) }] : chart.series;
    const values = series.flatMap(({ values: points }) => points);
    const maximum = Math.max(...values, 1);
    const width = 540;
    const height = 235;
    const margin = { top: 15, right: 16, bottom: 45, left: 52 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const x = (index) => margin.left + (labels.length === 1 ? chartWidth / 2 : (index * chartWidth) / (labels.length - 1));
    const y = (value) => margin.top + chartHeight - (value / maximum) * chartHeight;
    const ticks = [0, 0.25, 0.5, 0.75, 1];

    return <div className="line-chart">
        {series.length > 1 && <div className="chart-key">{series.map(({ label }, index) => <span key={label}><i style={{ background: COLORS[index] }} />{label}</span>)}</div>}
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.title}>
            {ticks.map((tick) => <g key={tick}><line x1={margin.left} x2={width - margin.right} y1={y(maximum * tick)} y2={y(maximum * tick)} className="line-grid" /><text x={margin.left - 8} y={y(maximum * tick) + 4} textAnchor="end" className="line-tick">{formatValue(maximum * tick)}</text></g>)}
            {series.map(({ label, values: points }, seriesIndex) => <g key={label}><polyline fill="none" stroke={COLORS[seriesIndex]} strokeWidth="2.5" points={points.map((value, index) => `${x(index)},${y(value)}`).join(" ")} />{points.map((value, index) => <circle key={index} cx={x(index)} cy={y(value)} r="3.5" fill="#fff" stroke={COLORS[seriesIndex]} strokeWidth="2" />)}</g>)}
            {labels.map((label, index) => <text key={label} x={x(index)} y={height - 18} textAnchor="middle" className="line-label">{label.length > 13 ? `${label.slice(0, 12)}…` : label}</text>)}
        </svg>
    </div>;
}

function ChartMenu({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return <div className="chart-menu-wrap" ref={ref}>
        <button className="chart-menu-button" type="button" aria-label="Choose chart type" aria-expanded={open} onClick={() => setOpen(!open)}>⋯</button>
        {open && <div className="chart-menu" role="menu">{[["bar", "Bar chart"], ["line", "Line chart"], ["pie", "Pie chart"]].map(([type, label]) => <button type="button" role="menuitem" className={value === type ? "selected" : ""} key={type} onClick={() => { onChange(type); setOpen(false); }}>{label}</button>)}</div>}
    </div>;
}

export default function AnalyticsCharts({ charts }) {
    const [choices, setChoices] = useState({});
    if (!charts.length) return <p className="analytics-empty">Add column headings and data to see automatic charts here.</p>;

    return <div className="analytics-charts">{charts.map((chart) => {
        const selectedType = choices[chart.id] || (chart.type === "grouped" ? "bar" : chart.type);
        return <section className="analytics-chart-card" key={chart.id}>
            <div className="chart-card-heading"><h2>{chart.title}</h2><ChartMenu value={selectedType} onChange={(type) => setChoices((current) => ({ ...current, [chart.id]: type }))} /></div>
            {selectedType === "pie" ? <PieChart chart={chart} /> : selectedType === "line" ? <LineChart chart={chart} /> : <BarChart chart={chart} />}
        </section>;
    })}</div>;
}
