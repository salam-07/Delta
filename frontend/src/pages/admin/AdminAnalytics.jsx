import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminStore } from "../../store/useAdminStore";
import { useSocketStore } from "../../store/useSocketStore";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { Change, Readout, ReadoutStrip } from "../../components/ui/Readout";
import { EmptyState, ErrorPanel, LoadingPanel, Lamp, StatusPill } from "../../components/ui/Feedback";
import { count, dateTime, money, signedPercent } from "../../lib/format";

/**
 * Analytics: the competition's state in figures.
 *
 * Ruled readout strips grouped by subject, not a page of stat cards. Every
 * figure used to be its own bordered card with a `text-6xl` value — four across
 * at that size, plus two at `text-8xl` above them — and the detail rows sat in
 * cards nested inside cards.
 */
const AdminAnalytics = () => {
    const { analytics, isAnalyticsLoading, getAnalytics } = useAdminStore();
    const { onlineUsers } = useSocketStore();

    useEffect(() => {
        getAnalytics();
    }, [getAnalytics]);

    const refresh = (
        <Button size="sm" variant="ghost" onClick={getAnalytics} disabled={isAnalyticsLoading}>
            <RefreshCw
                className={`size-3 shrink-0 ${isAnalyticsLoading ? "animate-spin" : ""}`}
                aria-hidden="true"
            />
            Refresh
        </Button>
    );

    if (!analytics) {
        return (
            <AdminLayout title="Analytics" actions={refresh}>
                <Panel>
                    {isAnalyticsLoading ? (
                        <LoadingPanel label="Loading analytics" />
                    ) : (
                        <ErrorPanel
                            label="Analytics unavailable"
                            description="The figures could not be loaded."
                            action={
                                <Button variant="primary" onClick={getAnalytics}>
                                    Try again
                                </Button>
                            }
                        />
                    )}
                </Panel>
            </AdminLayout>
        );
    }

    const { overview, userMetrics, tradingMetrics, stockMetrics, contentMetrics, recentActivity } = analytics;
    const movers = stockMetrics?.topPerformingStocks ?? [];
    const mostHeld = stockMetrics?.mostHeldStock;
    const recent = recentActivity?.recentTrades ?? [];

    return (
        <AdminLayout title="Analytics" actions={refresh}>
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="System">
                        <span className="flex items-center gap-2 font-term text-[11px] uppercase tracking-label">
                            <Lamp on={overview?.marketOpen} />
                            <span className={overview?.marketOpen ? "text-signal-up" : "text-signal-down"}>
                                {overview?.marketOpen ? "Market open" : "Market closed"}
                            </span>
                        </span>
                    </PanelHeader>
                    <ReadoutStrip cols={4}>
                        <Readout
                            label="Value in play"
                            value={money(overview?.totalAssets)}
                            note="Cash plus holdings at live prices"
                            tone="accent"
                        />
                        <Readout label="Cash held" value={money(overview?.totalCashBalance)} />
                        <Readout label="Holdings" value={money(overview?.totalPortfolioValue)} />
                        <Readout
                            label="Traded volume"
                            value={money(overview?.totalTradeVolume)}
                            note="All-time, both sides"
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Participants" />
                    <ReadoutStrip cols={4}>
                        <Readout label="Registered" value={count(overview?.totalUsers)} />
                        <Readout label="Online now" value={count(onlineUsers.length)} tone="accent" />
                        <Readout
                            label="Holding a position"
                            value={count(userMetrics?.totalInvestedUsers)}
                            note={`${signedPercent(userMetrics?.tradingActivityRate).replace("+", "")} of the field`}
                        />
                        <Readout label="With a portfolio" value={count(userMetrics?.usersWithPortfolio)} />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Trading" />
                    <ReadoutStrip cols={4}>
                        <Readout label="Orders filled" value={count(tradingMetrics?.totalTrades)} />
                        <Readout label="Buys" value={count(tradingMetrics?.buyTrades)} tone="up" />
                        <Readout label="Sells" value={count(tradingMetrics?.sellTrades)} tone="down" />
                        <Readout label="Average order" value={money(tradingMetrics?.averageTradeSize)} />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Movers">
                        {mostHeld?.ticker && mostHeld.ticker !== "N/A" ? (
                            <span className="font-term text-[11px] text-phosphor-mid">
                                Most held{" "}
                                <span className="text-phosphor">{mostHeld.ticker}</span> · {count(mostHeld.count)} holders
                            </span>
                        ) : null}
                    </PanelHeader>

                    <ReadoutStrip cols={3} className="border-b border-phosphor/20">
                        <Readout label="Listed" value={count(stockMetrics?.totalStocks)} />
                        <Readout label="Above open" value={count(stockMetrics?.stocksWithPriceIncrease)} tone="up" />
                        <Readout label="Below open" value={count(stockMetrics?.stocksWithPriceDecrease)} tone="down" />
                    </ReadoutStrip>

                    {movers.length === 0 ? (
                        <EmptyState
                            label="No listings"
                            description="Movers are ranked once there is a stock to rank."
                        />
                    ) : (
                        <ul>
                            {movers.map((stock) => (
                                <li
                                    key={stock.ticker}
                                    className="flex items-center gap-4 border-b border-phosphor/15 px-4 py-3 last:border-b-0"
                                >
                                    <span className="w-16 shrink-0 font-term text-sm text-phosphor">{stock.ticker}</span>
                                    <span className="min-w-0 flex-1 truncate font-term text-xs text-phosphor-mid">
                                        {stock.name}
                                    </span>
                                    <span className="shrink-0 font-term text-sm text-phosphor-bright">
                                        {money(stock.currentPrice)}
                                    </span>
                                    <Change
                                        absolute={stock.change}
                                        percent={stock.changePercent}
                                        showAbsolute={false}
                                        className="w-24 shrink-0 justify-end text-xs"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Panel>
                        <PanelHeader label="The wire" />
                        <ReadoutStrip cols={3}>
                            <Readout label="Developments" value={count(contentMetrics?.totalDevelopments)} size="sm" />
                            <Readout
                                label="Published"
                                value={count(contentMetrics?.publishedDevelopments)}
                                tone="accent"
                                size="sm"
                            />
                            <Readout
                                label="Drafts"
                                value={count(contentMetrics?.draftDevelopments)}
                                tone="muted"
                                size="sm"
                            />
                        </ReadoutStrip>
                    </Panel>

                    <Panel>
                        <PanelHeader label="Last five fills" />
                        {recent.length === 0 ? (
                            <EmptyState label="No trades yet" description="Fills appear here as they happen." />
                        ) : (
                            <ul>
                                {recent.map((trade, index) => (
                                    <li
                                        key={`${trade.date}-${index}`}
                                        className="flex items-center gap-3 border-b border-phosphor/15 px-4 py-2.5 last:border-b-0"
                                    >
                                        <StatusPill tone={trade.type === "sell" ? "halted" : "live"}>
                                            {trade.type === "sell" ? "Sell" : "Buy"}
                                        </StatusPill>
                                        <span className="min-w-0 flex-1 truncate font-term text-xs text-phosphor-bright">
                                            {trade.traderName}
                                        </span>
                                        <span className="shrink-0 font-term text-xs text-phosphor">
                                            {count(trade.amount)} {trade.stockTicker}
                                        </span>
                                        <span className="hidden shrink-0 font-term text-[11px] text-signal-cyanDim sm:inline">
                                            {dateTime(trade.date)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Panel>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
