import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Receipt } from 'lucide-react';
import UserLayout from '../../layouts/UserLayout';
import { useTradeStore } from '../../store/useTradeStore';
import { Panel, PanelHeader } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Readout, ReadoutStrip } from '../../components/ui/Readout';
import { EmptyState, SkeletonRows, SkeletonValue, StatusPill } from '../../components/ui/Feedback';
import { count, dateTime, money } from '../../lib/format';

const PAGE = 20;

/**
 * The participant's own ledger: every order they have filled, newest first.
 *
 * A ledger is read as rows, so the page is rows — the activity figures sit in
 * one ruled strip above them instead of a hero count and four cards repeating
 * the same series.
 */
const UserHistory = () => {
    const { tradeHistory, isLoadingHistory, viewHistory } = useTradeStore();
    const [visible, setVisible] = useState(PAGE);

    useEffect(() => {
        viewHistory();
    }, [viewHistory]);

    const summary = useMemo(() => {
        const volume = tradeHistory.reduce(
            (sum, trade) => sum + (Number(trade.total) || Number(trade.tradePrice) * Number(trade.amount) || 0),
            0
        );
        return {
            buys: tradeHistory.filter((t) => t.type?.toLowerCase() === 'buy').length,
            sells: tradeHistory.filter((t) => t.type?.toLowerCase() === 'sell').length,
            volume,
            average: tradeHistory.length > 0 ? volume / tradeHistory.length : 0,
        };
    }, [tradeHistory]);

    const row = (trade) => {
        const isBuy = trade.type?.toLowerCase() === 'buy';
        return {
            isBuy,
            side: isBuy ? 'Buy' : 'Sell',
            ticker: trade.stockId?.ticker || trade.ticker || '—',
            name: trade.stockId?.name || null,
            shares: Number(trade.amount) || 0,
            price: Number(trade.tradePrice) || 0,
            value: Number(trade.total) || Number(trade.tradePrice) * Number(trade.amount) || 0,
            at: dateTime(trade.createdAt),
        };
    };

    const refresh = (
        <Button size="sm" variant="ghost" onClick={viewHistory} disabled={isLoadingHistory}>
            <RefreshCw className={`size-3 shrink-0 ${isLoadingHistory ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
        </Button>
    );

    const remaining = tradeHistory.length - visible;

    return (
        <UserLayout title="History" actions={refresh}>
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="Activity" />
                    <ReadoutStrip cols={4}>
                        <Readout
                            label="Orders filled"
                            value={isLoadingHistory ? <SkeletonValue className="w-16" /> : count(tradeHistory.length)}
                            tone="accent"
                        />
                        <Readout
                            label="Buys"
                            value={isLoadingHistory ? <SkeletonValue className="w-12" /> : count(summary.buys)}
                            tone={summary.buys > 0 ? 'up' : 'muted'}
                        />
                        <Readout
                            label="Sells"
                            value={isLoadingHistory ? <SkeletonValue className="w-12" /> : count(summary.sells)}
                            tone={summary.sells > 0 ? 'down' : 'muted'}
                        />
                        <Readout
                            label="Volume traded"
                            value={isLoadingHistory ? <SkeletonValue className="w-24" /> : money(summary.volume)}
                            note={`${money(summary.average)} average order`}
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Ledger">
                        {tradeHistory.length > 0 ? (
                            <span className="font-term text-[11px] text-phosphor-mid">
                                Showing {count(Math.min(visible, tradeHistory.length))} of {count(tradeHistory.length)}
                            </span>
                        ) : null}
                    </PanelHeader>

                    {isLoadingHistory && tradeHistory.length === 0 ? (
                        <SkeletonRows rows={6} />
                    ) : tradeHistory.length === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            label="No orders filled"
                            description="Your ledger records every buy and sell you place. It starts once you fill your first order."
                            action={
                                <Button as={Link} to="/user/trade" variant="primary">
                                    Place an order
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            {/* Table — sm and up */}
                            <div className="hidden sm:block">
                                <table className="w-full">
                                    <caption className="sr-only">Your filled orders, newest first</caption>
                                    <thead>
                                        <tr className="border-b border-phosphor/20 bg-ink-raised">
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Time
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Side
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
                                        {tradeHistory.slice(0, visible).map((trade, index) => {
                                            const r = row(trade);
                                            return (
                                                <tr key={trade._id || index} className="data-row">
                                                    <td className="whitespace-nowrap px-4 py-3 font-term text-xs text-signal-cyanDim">
                                                        {r.at}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <StatusPill tone={r.isBuy ? 'live' : 'halted'}>{r.side}</StatusPill>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-term text-sm text-phosphor-bright">{r.ticker}</span>
                                                        {r.name ? (
                                                            <span className="mt-0.5 block max-w-[14rem] truncate font-term text-xs text-phosphor-mid">
                                                                {r.name}
                                                            </span>
                                                        ) : null}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                        {count(r.shares)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-mid">
                                                        {money(r.price)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                        {money(r.value)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Stacked rows — below sm */}
                            <ul className="sm:hidden">
                                {tradeHistory.slice(0, visible).map((trade, index) => {
                                    const r = row(trade);
                                    return (
                                        <li
                                            key={trade._id || index}
                                            className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <StatusPill tone={r.isBuy ? 'live' : 'halted'}>{r.side}</StatusPill>
                                                    <span className="truncate font-term text-sm text-phosphor-bright">
                                                        {r.ticker}
                                                    </span>
                                                </div>
                                                <span className="shrink-0 font-term text-sm text-phosphor-bright">
                                                    {money(r.value)}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 flex items-baseline justify-between gap-3">
                                                <span className="font-term text-xs text-phosphor-mid">
                                                    {count(r.shares)} @ {money(r.price)}
                                                </span>
                                                <span className="shrink-0 font-term text-[11px] text-signal-cyanDim">
                                                    {r.at}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            {remaining > 0 ? (
                                <div className="border-t border-phosphor/25 bg-ink-raised px-4 py-3 text-center">
                                    <Button onClick={() => setVisible((n) => n + PAGE)}>
                                        Show {count(Math.min(PAGE, remaining))} more
                                    </Button>
                                </div>
                            ) : null}
                        </>
                    )}
                </Panel>
            </div>
        </UserLayout>
    );
};

export default UserHistory;
