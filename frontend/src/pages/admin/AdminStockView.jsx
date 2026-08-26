import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useMarketStore } from "../../store/useMarketStore";
import { useAdminStore } from "../../store/useAdminStore";
import PriceChart from "../../components/PriceChart";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/Field";
import { Change, Readout, ReadoutStrip } from "../../components/ui/Readout";
import { ErrorPanel, LoadingPanel } from "../../components/ui/Feedback";
import { money, priceChange } from "../../lib/format";

/**
 * One listing, in full: its price, the record of how it got there, and the
 * controls that move it.
 */
const AdminStockView = () => {
    const { stockId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState("10");
    const [companyInfo, setCompanyInfo] = useState("");

    const {
        stock,
        stocks,
        fetchStock,
        fetchStockHistory,
        fetchAllStocks,
        fetchStockCompanyInfo,
        isStockLoading,
        isStocksLoading,
    } = useMarketStore();

    const { updateStock, updatingStockId } = useAdminStore();

    useEffect(() => {
        if (!stockId) return;
        fetchStock(stockId);
        fetchStockHistory(stockId);
        fetchStockCompanyInfo(stockId).then((data) => setCompanyInfo(data.companyInfo || ""));
    }, [stockId, fetchStock, fetchStockHistory, fetchStockCompanyInfo]);

    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const stepValue = () => {
        const parsed = parseFloat(step);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
    };

    const adjust = async (direction) => {
        const newPrice = Math.max(0.01, Number(stock.price) + stepValue() * direction);
        const updated = await updateStock(stockId, { newPrice });
        if (updated) {
            fetchStock(stockId);
            fetchStockHistory(stockId);
        }
    };

    // A switcher, not a form field: changing it navigates. It sits in the page
    // header because it is the fastest route between two listings.
    const switcher = (
        <>
            <label htmlFor="listing-switcher" className="sr-only">
                Switch to another listing
            </label>
            <select
                id="listing-switcher"
                value={stockId ?? ""}
                onChange={(e) => {
                    if (e.target.value && e.target.value !== stockId) navigate(`/admin/stocks/${e.target.value}`);
                }}
                disabled={isStocksLoading}
                className="h-8 w-40 cursor-pointer border border-phosphor/25 bg-ink px-2 font-term text-xs
                    text-phosphor-bright transition-colors hover:border-phosphor/40 focus:border-phosphor
                    disabled:cursor-not-allowed disabled:border-phosphor-dim sm:w-56"
            >
                {isStocksLoading ? <option value="">Loading…</option> : null}
                {stocks.map((option) => (
                    <option key={option._id} value={option._id}>
                        {option.ticker} — {option.name}
                    </option>
                ))}
            </select>
        </>
    );

    if (isStockLoading && !stock) {
        return (
            <AdminLayout title="Listing">
                <Panel>
                    <LoadingPanel label="Loading listing" />
                </Panel>
            </AdminLayout>
        );
    }

    if (!stock) {
        return (
            <AdminLayout title="Listing" actions={switcher}>
                <Panel>
                    <ErrorPanel
                        label="Listing not found"
                        description="This stock does not exist or has been delisted."
                        action={
                            <Button variant="primary" onClick={() => navigate("/admin/stocks")}>
                                Back to stocks
                            </Button>
                        }
                    />
                </Panel>
            </AdminLayout>
        );
    }

    const change = priceChange(stock);
    const busy = updatingStockId === stockId;

    return (
        <AdminLayout title={stock.ticker} actions={switcher}>
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label={stock.name || "Listing"}>
                        <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                            {stock.ticker}
                        </span>
                    </PanelHeader>
                    <ReadoutStrip cols={3}>
                        <Readout label="Price" value={money(stock.price)} tone="accent" size="lg" />
                        <Readout label="Open" value={money(stock.openingPrice ?? stock.price)} size="lg" />
                        <Readout
                            label="Change on open"
                            size="lg"
                            value={<Change absolute={change.absolute} percent={change.percent} size="lg" />}
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Price control" />
                    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end">
                        <TextField
                            label="Step"
                            type="number"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            min="0.01"
                            step="0.01"
                            prefix="$"
                            containerClassName="sm:w-40"
                        />
                        <div className="flex gap-2">
                            <Button variant="buy" size="lg" onClick={() => adjust(1)} loading={busy}>
                                <ChevronUp className="size-4 shrink-0" aria-hidden="true" />
                                Raise {money(stepValue())}
                            </Button>
                            <Button variant="sell" size="lg" onClick={() => adjust(-1)} loading={busy}>
                                <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
                                Lower {money(stepValue())}
                            </Button>
                        </div>
                    </div>
                    <p className="border-t border-phosphor/15 px-4 py-2.5 font-term text-[11px] text-phosphor-mid">
                        Every adjustment is recorded and broadcast to participants immediately. The price cannot go
                        below {money(0.01)}.
                    </p>
                </Panel>

                <Panel>
                    <PanelHeader label="Price record" />
                    <div className="px-4 py-4">
                        <PriceChart stockId={stockId} height={300} />
                    </div>
                </Panel>

                {companyInfo ? (
                    <Panel>
                        <PanelHeader label="Company information" />
                        <p className="whitespace-pre-wrap px-4 py-4 font-term text-xs leading-relaxed text-phosphor-bright">
                            {companyInfo}
                        </p>
                    </Panel>
                ) : null}
            </div>
        </AdminLayout>
    );
};

export default AdminStockView;
