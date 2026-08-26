import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartLine } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore';
import { EmptyState, ErrorPanel, LoadingPanel } from './ui/Feedback';
import { Button } from './ui/Button';
import { clockTime, dateTime, money } from '../lib/format';

/**
 * A stock's price record over the session.
 *
 * Recharts draws with SVG attributes, not classes, so the palette has to be
 * handed to it as literals. These are the same values `tailwind.config.js`
 * defines — signal.up / signal.down for direction, phosphor for structure —
 * and they are declared once here rather than sprinkled through the chart.
 */
const PLOT = {
    up: '#5BFF8F',      // signal.up
    down: '#FF4136',    // signal.down
    flat: '#31D96A',    // phosphor
    rule: '#1C5C38',    // phosphor.dim — grid only, never text
    axis: '#4FAE79',    // phosphor.mid — 7.25:1 on ink
    ink: '#050A07',
};

/** A ruled readout, not a rounded bubble: the same panel language as the app. */
const PlotTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return (
        <div className="border border-phosphor/40 bg-ink-panel px-3 py-2">
            <div className="font-term text-sm text-phosphor-bright">{money(point.price)}</div>
            <div className="mt-0.5 font-term text-[10px] uppercase tracking-label text-signal-cyanDim">
                {point.recordedAt}
            </div>
        </div>
    );
};

const PriceChart = ({ stockId, height = 400, showGrid = true, className = '' }) => {
    const { fetchStockHistory, history, isHistoryLoading, historyError } = useMarketStore();

    // The parent owns the fetch — this component had its own effect calling
    // `fetchStockHistory(stockId)` on mount, which duplicated every caller's
    // fetch and fired a second request for the same series on every selection.
    const chartData = useMemo(
        () =>
            (history ?? []).map((item) => ({
                time: clockTime(item.createdAt).slice(0, 5),
                price: parseFloat(item.price),
                recordedAt: dateTime(item.createdAt),
            })),
        [history]
    );

    // Direction over the whole series, matching the board's up/down semantics.
    const stroke = useMemo(() => {
        if (chartData.length < 2) return PLOT.flat;
        const first = chartData[0]?.price;
        const last = chartData[chartData.length - 1]?.price;
        if (last > first) return PLOT.up;
        if (last < first) return PLOT.down;
        return PLOT.flat;
    }, [chartData]);

    if (isHistoryLoading && chartData.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <LoadingPanel label="Loading price history" />
            </div>
        );
    }

    if (historyError) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <ErrorPanel
                    label="Price history unavailable"
                    description={historyError}
                    action={
                        stockId ? (
                            <Button size="sm" onClick={() => fetchStockHistory(stockId)}>
                                Try again
                            </Button>
                        ) : null
                    }
                />
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <EmptyState
                    icon={ChartLine}
                    label="No price history"
                    description="This stock has not recorded a price change yet. Its record starts building once the market opens."
                />
            </div>
        );
    }

    // Point markers help read a sparse series and only clutter a dense one.
    const showDots = chartData.length <= 40;

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
                    {showGrid && (
                        <CartesianGrid stroke={PLOT.rule} strokeDasharray="2 4" vertical={false} />
                    )}
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: PLOT.axis, fontSize: 10, fontFamily: 'Commit Mono, monospace' }}
                        minTickGap={40}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: PLOT.axis, fontSize: 10, fontFamily: 'Commit Mono, monospace' }}
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tickFormatter={(value) => money(value)}
                        width={72}
                    />
                    <Tooltip
                        content={<PlotTooltip />}
                        cursor={{ stroke: PLOT.axis, strokeDasharray: '2 3' }}
                    />
                    <Line
                        type="linear"
                        dataKey="price"
                        name="Price"
                        stroke={stroke}
                        strokeWidth={2}
                        dot={showDots ? { fill: stroke, stroke: PLOT.ink, strokeWidth: 1, r: 2.5 } : false}
                        activeDot={{ fill: stroke, stroke: PLOT.ink, strokeWidth: 1, r: 4 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
