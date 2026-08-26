import { useState, useEffect } from "react";
import { Landmark, RefreshCcw } from "lucide-react";
import { useMarketStore } from "../../store/useMarketStore";
import { useTradeStore } from "../../store/useTradeStore";
import { Panel, PanelHeader } from "../ui/Panel";
import { Button } from "../ui/Button";
import { Change } from "../ui/Readout";
import { EmptyState, SkeletonRows } from "../ui/Feedback";
import { InlineNumberField } from "../ui/Field";
import { money, priceChange } from "../../lib/format";

/**
 * The market board: every listed stock, its live price, its move against the
 * open, and the controls to trade it.
 *
 * Below `md` the table becomes stacked rows — a five-column trading grid is
 * unusable at 375px, and participants trade from phones.
 */
const UserStockTable = ({ showRefreshButton = true, title = "Market" }) => {
    const [shareAmounts, setShareAmounts] = useState({});
    const [pending, setPending] = useState(null);

    const { stocks, isStocksLoading, fetchAllStocks } = useMarketStore();
    const { buyStock, sellStock, isTrading } = useTradeStore();

    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const getShareAmount = (stockId) => shareAmounts[stockId] ?? 1;

    const handleShareAmountChange = (stockId, value) =>
        setShareAmounts((prev) => ({ ...prev, [stockId]: value }));

    /**
     * Trading is serialised — a participant may not fire two orders at once —
     * but only the row that was clicked shows the busy state. `isTrading` alone
     * spun every button on the board simultaneously.
     */
    const handleTrade = async (side, ticker, stockId) => {
        const shares = getShareAmount(stockId);
        if (!(shares > 0)) return;
        setPending({ stockId, side });
        try {
            await (side === "buy" ? buyStock : sellStock)(ticker, shares);
        } finally {
            setPending(null);
        }
    };

    const isPending = (stockId, side) => pending?.stockId === stockId && pending?.side === side;

    const tradeControls = (stock, layout) => (
        <div className={`flex items-center gap-1.5 ${layout === "row" ? "justify-center" : ""}`}>
            <Button
                size="sm"
                variant="buy"
                className="min-w-[4.25rem]"
                onClick={() => handleTrade("buy", stock.ticker, stock._id)}
                disabled={isTrading}
                loading={isPending(stock._id, "buy")}
            >
                Buy
            </Button>
            <InlineNumberField
                value={getShareAmount(stock._id)}
                onChange={(e) => handleShareAmountChange(stock._id, parseInt(e.target.value, 10) || 1)}
                min="1"
                step="1"
                className="w-16"
                aria-label={`Shares of ${stock.ticker} to trade`}
            />
            <Button
                size="sm"
                variant="sell"
                className="min-w-[4.25rem]"
                onClick={() => handleTrade("sell", stock.ticker, stock._id)}
                disabled={isTrading}
                loading={isPending(stock._id, "sell")}
            >
                Sell
            </Button>
        </div>
    );

    return (
        <Panel ticks>
            <PanelHeader label={title}>
                {showRefreshButton ? (
                    <Button size="sm" variant="ghost" onClick={fetchAllStocks} disabled={isStocksLoading}>
                        <RefreshCcw
                            className={`size-3 shrink-0 ${isStocksLoading ? "animate-spin" : ""}`}
                            aria-hidden="true"
                        />
                        Refresh
                    </Button>
                ) : null}
            </PanelHeader>

            {isStocksLoading && stocks.length === 0 ? (
                <SkeletonRows rows={6} />
            ) : stocks.length === 0 ? (
                <EmptyState
                    icon={Landmark}
                    label="No stocks listed"
                    description="The market has no listings yet. An administrator lists stocks before trading opens."
                />
            ) : (
                <>
                    {/* Table — md and up */}
                    <div className="hidden md:block">
                        <table className="w-full">
                            <caption className="sr-only">Listed stocks with live prices and trade controls</caption>
                            <thead>
                                <tr className="border-b border-phosphor/20 bg-ink-raised">
                                    <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                        Ticker
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                        Name
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                        Price
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                        Change
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-center font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                        Order
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock) => {
                                    const change = priceChange(stock);
                                    return (
                                        <tr key={stock._id} className="data-row">
                                            <td className="px-4 py-3">
                                                <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                                                    {stock.ticker}
                                                </span>
                                            </td>
                                            <td className="max-w-[16rem] truncate px-4 py-3 font-term text-sm text-phosphor-bright">
                                                {stock.name}
                                            </td>
                                            <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                {money(stock.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs">
                                                <Change absolute={change.absolute} percent={change.percent} />
                                            </td>
                                            <td className="px-4 py-3">{tradeControls(stock, "row")}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Stacked rows — below md */}
                    <ul className="md:hidden">
                        {stocks.map((stock) => {
                            const change = priceChange(stock);
                            return (
                                <li key={stock._id} className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                                            {stock.ticker}
                                        </span>
                                        <span className="font-term text-base text-phosphor-bright">{money(stock.price)}</span>
                                    </div>
                                    <div className="mt-1.5 flex items-baseline justify-between gap-3">
                                        <span className="min-w-0 truncate font-term text-xs text-phosphor-mid">{stock.name}</span>
                                        <Change absolute={change.absolute} percent={change.percent} className="shrink-0 text-xs" />
                                    </div>
                                    <div className="mt-3">{tradeControls(stock, "stack")}</div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </Panel>
    );
};

export default UserStockTable;
