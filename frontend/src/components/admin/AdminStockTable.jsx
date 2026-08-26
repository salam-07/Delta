import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Landmark, RefreshCw, Trash2 } from "lucide-react";
import { useMarketStore } from "../../store/useMarketStore";
import { useAdminStore } from "../../store/useAdminStore";
import { Panel, PanelHeader } from "../ui/Panel";
import { Button } from "../ui/Button";
import { Change } from "../ui/Readout";
import { InlineNumberField } from "../ui/Field";
import { EmptyState, SkeletonRows } from "../ui/Feedback";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { money, priceChange } from "../../lib/format";

const DEFAULT_STEP = 10;

/**
 * Market control: every listing, its live price, and the controls that move it.
 *
 * One link per row, on the ticker. Every cell used to be wrapped in its own
 * `<Link>` to the same stock, which put five identical links in the tab order
 * per row and made the price controls sit inside a navigation target.
 */
const AdminStockTable = ({
    showActions = true,
    showDeleteColumn = true,
    showRefreshButton = true,
    title = "Listings",
}) => {
    const [steps, setSteps] = useState({});
    const [pendingDelete, setPendingDelete] = useState(null);

    const { stocks, isStocksLoading, fetchAllStocks } = useMarketStore();
    const { updateStock, deleteStock, updatingStockId, deletingStockId } = useAdminStore();

    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const step = (stockId) => {
        const raw = steps[stockId];
        const parsed = parseFloat(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_STEP;
    };

    const adjust = (stock, direction) => {
        const delta = step(stock._id) * direction;
        const newPrice = Math.max(0.01, parseFloat(stock.price) + delta);
        updateStock(stock._id, { newPrice });
    };

    const priceControls = (stock) => {
        const busy = updatingStockId === stock._id;
        return (
            <div className="flex items-center justify-center gap-1.5">
                <Button
                    size="sm"
                    variant="buy"
                    icon
                    onClick={() => adjust(stock, 1)}
                    disabled={busy}
                    aria-label={`Raise ${stock.ticker} by ${money(step(stock._id))}`}
                >
                    <ChevronUp className="size-3.5" aria-hidden="true" />
                </Button>
                <InlineNumberField
                    value={steps[stock._id] ?? DEFAULT_STEP}
                    onChange={(e) => setSteps((prev) => ({ ...prev, [stock._id]: e.target.value }))}
                    min="0.01"
                    step="1"
                    className="w-16"
                    aria-label={`Price step for ${stock.ticker} in dollars`}
                />
                <Button
                    size="sm"
                    variant="sell"
                    icon
                    onClick={() => adjust(stock, -1)}
                    disabled={busy}
                    aria-label={`Lower ${stock.ticker} by ${money(step(stock._id))}`}
                >
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                </Button>
            </div>
        );
    };

    const ticker = (stock) => (
        <Link
            to={`/admin/stocks/${stock._id}`}
            className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor
                transition-colors hover:border-phosphor hover:bg-phosphor/20"
        >
            {stock.ticker}
        </Link>
    );

    return (
        <>
            <Panel ticks>
                <PanelHeader label={title}>
                    {showRefreshButton ? (
                        <Button size="sm" variant="ghost" onClick={fetchAllStocks} disabled={isStocksLoading}>
                            <RefreshCw
                                className={`size-3 shrink-0 ${isStocksLoading ? "animate-spin" : ""}`}
                                aria-hidden="true"
                            />
                            Refresh
                        </Button>
                    ) : null}
                </PanelHeader>

                {isStocksLoading && stocks.length === 0 ? (
                    <SkeletonRows rows={5} />
                ) : stocks.length === 0 ? (
                    <EmptyState
                        icon={Landmark}
                        label="No listings"
                        description="The market has nothing to trade. List a stock to open the board."
                        action={
                            <Button as={Link} to="/admin/stocks" variant="primary">
                                List a stock
                            </Button>
                        }
                    />
                ) : (
                    <>
                        {/* Table — lg and up. The price controls need the width. */}
                        <div className="hidden lg:block">
                            <table className="w-full">
                                <caption className="sr-only">
                                    Listed stocks with live prices and price controls
                                </caption>
                                <thead>
                                    <tr className="border-b border-phosphor/20 bg-ink-raised">
                                        <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Ticker
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Name
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Open
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Price
                                        </th>
                                        <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Change
                                        </th>
                                        {showActions ? (
                                            <th scope="col" className="px-4 py-2 text-center font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Adjust price
                                            </th>
                                        ) : null}
                                        {showDeleteColumn ? (
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Delist
                                            </th>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map((stock) => {
                                        const change = priceChange(stock);
                                        return (
                                            <tr key={stock._id} className="data-row">
                                                <td className="px-4 py-3">{ticker(stock)}</td>
                                                <td className="max-w-[14rem] truncate px-4 py-3 font-term text-sm text-phosphor-bright">
                                                    {stock.name}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-mid">
                                                    {money(stock.openingPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                    {money(stock.price)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs">
                                                    <Change absolute={change.absolute} percent={change.percent} />
                                                </td>
                                                {showActions ? (
                                                    <td className="px-4 py-3">{priceControls(stock)}</td>
                                                ) : null}
                                                {showDeleteColumn ? (
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            icon
                                                            onClick={() => setPendingDelete(stock)}
                                                            loading={deletingStockId === stock._id}
                                                            aria-label={`Delist ${stock.ticker}`}
                                                        >
                                                            <Trash2 className="size-3.5" aria-hidden="true" />
                                                        </Button>
                                                    </td>
                                                ) : null}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Stacked rows — below lg */}
                        <ul className="lg:hidden">
                            {stocks.map((stock) => {
                                const change = priceChange(stock);
                                return (
                                    <li key={stock._id} className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0">
                                        <div className="flex items-center justify-between gap-3">
                                            {ticker(stock)}
                                            <span className="font-term text-base text-phosphor-bright">
                                                {money(stock.price)}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 flex items-baseline justify-between gap-3">
                                            <span className="min-w-0 truncate font-term text-xs text-phosphor-mid">
                                                {stock.name}
                                            </span>
                                            <Change
                                                absolute={change.absolute}
                                                percent={change.percent}
                                                className="shrink-0 text-xs"
                                            />
                                        </div>
                                        {showActions || showDeleteColumn ? (
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                {showActions ? priceControls(stock) : <span />}
                                                {showDeleteColumn ? (
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        icon
                                                        onClick={() => setPendingDelete(stock)}
                                                        loading={deletingStockId === stock._id}
                                                        aria-label={`Delist ${stock.ticker}`}
                                                    >
                                                        <Trash2 className="size-3.5" aria-hidden="true" />
                                                    </Button>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </Panel>

            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title={`Delist ${pendingDelete?.ticker ?? ""}?`}
                description={
                    pendingDelete
                        ? `${pendingDelete.name} is removed from the market board and can no longer be traded. Participants keep any shares they already hold, and this cannot be undone.`
                        : undefined
                }
                confirmLabel="Delist"
                loading={deletingStockId === pendingDelete?._id}
                onConfirm={async () => {
                    const id = pendingDelete._id;
                    setPendingDelete(null);
                    await deleteStock(id);
                }}
                onCancel={() => setPendingDelete(null)}
            />
        </>
    );
};

export default AdminStockTable;
