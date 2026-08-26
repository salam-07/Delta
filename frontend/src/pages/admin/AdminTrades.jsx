import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Receipt } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminStore } from "../../store/useAdminStore";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { EmptyState, SkeletonRows, StatusPill } from "../../components/ui/Feedback";
import { Readout, ReadoutStrip } from "../../components/ui/Readout";
import { count, dateTime, money } from "../../lib/format";

const PAGE = 25;

/**
 * The market-wide tape: every order filled, newest first.
 *
 * A ledger with columns, not a stack of sentences. The page led with a `text-8xl`
 * count of all trades, which is the least useful figure on it — an administrator
 * comes here to find a specific fill.
 */
const AdminTrades = () => {
    const { tradeHistory, isTradeHistoryLoading, getTradeHistory } = useAdminStore();
    const [visible, setVisible] = useState(PAGE);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getTradeHistory();
    }, [getTradeHistory]);

    const row = (trade) => {
        const amount = Number(trade.amount) || 0;
        const price = Number(trade.tradePrice) || 0;
        return {
            id: trade._id,
            when: trade.createdAt,
            side: trade.type?.toLowerCase() === "sell" ? "sell" : "buy",
            trader: trade.traderId?.fullName || trade.traderId?.name || "Unknown participant",
            email: trade.traderId?.email ?? "",
            ticker: trade.stockId?.ticker || trade.ticker || "—",
            amount,
            price,
            value: Number(trade.total) || price * amount,
        };
    };

    const rows = useMemo(() => tradeHistory.map(row), [tradeHistory]);

    const summary = useMemo(() => {
        const buys = rows.filter((entry) => entry.side === "buy").length;
        const volume = rows.reduce((sum, entry) => sum + entry.value, 0);
        return {
            buys,
            sells: rows.length - buys,
            volume,
            average: rows.length > 0 ? volume / rows.length : 0,
        };
    }, [rows]);

    const shown = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter(
            (entry) =>
                entry.trader.toLowerCase().includes(needle) ||
                entry.ticker.toLowerCase().includes(needle) ||
                entry.email.toLowerCase().includes(needle)
        );
    }, [rows, query]);

    const sidePill = (side) => (
        <StatusPill tone={side === "buy" ? "live" : "halted"}>{side === "buy" ? "Buy" : "Sell"}</StatusPill>
    );

    return (
        <AdminLayout
            title="Trades"
            actions={
                <Button size="sm" variant="ghost" onClick={getTradeHistory} disabled={isTradeHistoryLoading}>
                    <RefreshCw
                        className={`size-3 shrink-0 ${isTradeHistoryLoading ? "animate-spin" : ""}`}
                        aria-hidden="true"
                    />
                    Refresh
                </Button>
            }
        >
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="All trading activity" />
                    <ReadoutStrip cols={4}>
                        <Readout label="Orders filled" value={count(rows.length)} tone="accent" />
                        <Readout label="Buys" value={count(summary.buys)} tone="up" />
                        <Readout label="Sells" value={count(summary.sells)} tone="down" />
                        <Readout
                            label="Volume"
                            value={money(summary.volume)}
                            note={`${money(summary.average)} average`}
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label={query ? `${shown.length} of ${rows.length} shown` : "The tape"} />

                    <div className="border-b border-phosphor/15 px-4 py-4">
                        <TextField
                            label="Search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Participant, email or ticker"
                            autoComplete="off"
                            containerClassName="max-w-sm"
                        />
                    </div>

                    {isTradeHistoryLoading && rows.length === 0 ? (
                        <SkeletonRows rows={8} />
                    ) : shown.length === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            label={rows.length === 0 ? "No trades yet" : "Nothing matches"}
                            description={
                                rows.length === 0
                                    ? "Every filled order appears here with the participant, the stock and the price it filled at."
                                    : "No order matches that participant, email or ticker."
                            }
                            action={
                                rows.length > 0 ? (
                                    <Button variant="default" onClick={() => setQuery("")}>
                                        Clear search
                                    </Button>
                                ) : null
                            }
                        />
                    ) : (
                        <>
                            {/* Ledger — md and up */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[48rem]">
                                    <caption className="sr-only">Every order filled, newest first</caption>
                                    <thead>
                                        <tr className="border-b border-phosphor/20 bg-ink-raised">
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Time
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Side
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Participant
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Stock
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Shares
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Price
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shown.slice(0, visible).map((entry) => (
                                            <tr key={entry.id} className="data-row">
                                                <td className="whitespace-nowrap px-4 py-3 font-term text-xs text-signal-cyanDim">
                                                    {dateTime(entry.when)}
                                                </td>
                                                <td className="px-4 py-3">{sidePill(entry.side)}</td>
                                                <td className="max-w-[13rem] truncate px-4 py-3 font-term text-sm text-phosphor-bright">
                                                    {entry.trader}
                                                </td>
                                                <td className="px-4 py-3 font-term text-sm text-phosphor">
                                                    {entry.ticker}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                    {count(entry.amount)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-mid">
                                                    {money(entry.price)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                    {money(entry.value)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Stacked rows — below md */}
                            <ul className="md:hidden">
                                {shown.slice(0, visible).map((entry) => (
                                    <li key={entry.id} className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-2">
                                                {sidePill(entry.side)}
                                                <span className="font-term text-sm text-phosphor">{entry.ticker}</span>
                                            </span>
                                            <span className="font-term text-sm text-phosphor-bright">
                                                {money(entry.value)}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 truncate font-term text-xs text-phosphor-bright">
                                            {entry.trader}
                                        </p>
                                        <p className="mt-0.5 font-term text-[11px] text-phosphor-mid">
                                            {count(entry.amount)} at {money(entry.price)} ·{" "}
                                            <span className="text-signal-cyanDim">{dateTime(entry.when)}</span>
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            {visible < shown.length ? (
                                <div className="border-t border-phosphor/20 px-4 py-3">
                                    <Button variant="default" size="sm" onClick={() => setVisible((n) => n + PAGE)}>
                                        Show {Math.min(PAGE, shown.length - visible)} more
                                    </Button>
                                </div>
                            ) : null}
                        </>
                    )}
                </Panel>
            </div>
        </AdminLayout>
    );
};

export default AdminTrades;
