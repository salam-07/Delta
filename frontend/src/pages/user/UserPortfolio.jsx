import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, RefreshCw } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import { useTradeStore } from "../../store/useTradeStore";
import { useMarketStore } from "../../store/useMarketStore";
import { Panel, PanelHeader } from "../../components/ui/Panel";
import { Button } from "../../components/ui/Button";
import { Change, Readout, ReadoutStrip } from "../../components/ui/Readout";
import { EmptyState, SkeletonRows, SkeletonValue } from "../../components/ui/Feedback";
import { count, money, signedMoney } from "../../lib/format";

/**
 * What the participant owns and what it is worth right now.
 *
 * The position summary is one ruled strip rather than a wall of hero numbers:
 * net worth only means something next to the cash and holdings that make it up,
 * and the return that follows from them, so all four are read in one sweep.
 */
const UserPortfolio = () => {
    const {
        portfolio,
        balance,
        viewPortfolio,
        checkBalance,
        getTotalAssets,
        getPortfolioValue,
        getProfitLoss,
        getProfitLossPercentage,
        isLoadingPortfolio,
        isLoadingBalance,
    } = useTradeStore();

    const { stocks, fetchAllStocks } = useMarketStore();

    useEffect(() => {
        viewPortfolio();
        checkBalance();
        fetchAllStocks();
    }, [viewPortfolio, checkBalance, fetchAllStocks]);

    const isLoading = isLoadingPortfolio || isLoadingBalance;

    const portfolioValue = getPortfolioValue();
    const totalAssets = getTotalAssets();
    const profitLoss = getProfitLoss();
    const profitLossPercentage = getProfitLossPercentage();

    /** A holding valued at the live market price, not the price it was bought at. */
    const position = (holding) => {
        const stock = stocks.find((s) => s.ticker === holding.ticker);
        const currentPrice = stock ? parseFloat(stock.price) : null;
        const buyPrice = parseFloat(holding.tradePrice) || 0;
        const quantity = parseFloat(holding.amount) || 0;
        const invested = buyPrice * quantity;
        const marketValue = currentPrice === null ? null : currentPrice * quantity;
        const gain = marketValue === null ? null : marketValue - invested;

        return {
            name: stock?.name ?? null,
            currentPrice,
            buyPrice,
            quantity,
            marketValue,
            gain,
            gainPercent: gain === null || invested <= 0 ? null : (gain / invested) * 100,
        };
    };

    const handleRefresh = () => {
        viewPortfolio();
        checkBalance();
        fetchAllStocks();
    };

    const refresh = (
        <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`size-3 shrink-0 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
        </Button>
    );

    return (
        <UserLayout title="Portfolio" actions={refresh}>
            <div className="space-y-6">
                <Panel ticks>
                    <PanelHeader label="Position" />
                    <ReadoutStrip cols={4}>
                        <Readout
                            label="Net worth"
                            value={isLoading ? <SkeletonValue className="w-28" /> : money(totalAssets)}
                            note="Cash and holdings"
                            tone="accent"
                            size="lg"
                        />
                        <Readout
                            label="Cash"
                            value={isLoading ? <SkeletonValue className="w-24" /> : money(balance)}
                            note="Available to trade"
                        />
                        <Readout
                            label="Holdings"
                            value={isLoading ? <SkeletonValue className="w-24" /> : money(portfolioValue)}
                            note={`${count(portfolio.length)} ${portfolio.length === 1 ? "position" : "positions"}`}
                        />
                        <Readout
                            label="Return"
                            value={
                                isLoading ? (
                                    <SkeletonValue className="w-24" />
                                ) : (
                                    <Change
                                        absolute={profitLoss}
                                        percent={profitLossPercentage}
                                        size="lg"
                                    />
                                )
                            }
                            note="Against starting cash"
                        />
                    </ReadoutStrip>
                </Panel>

                <Panel>
                    <PanelHeader label="Holdings">
                        <span className="font-term text-[11px] text-phosphor-mid">
                            {count(portfolio.length)} {portfolio.length === 1 ? "position" : "positions"}
                        </span>
                    </PanelHeader>

                    {isLoading && portfolio.length === 0 ? (
                        <SkeletonRows rows={4} />
                    ) : portfolio.length === 0 ? (
                        <EmptyState
                            icon={PieChart}
                            label="No holdings yet"
                            description="You hold cash only. Buy a stock on the market board and it appears here with its live value."
                            action={
                                <Button as={Link} to="/user/trade" variant="primary">
                                    Place an order
                                </Button>
                            }
                        />
                    ) : (
                        <>
                            {/* Table — md and up */}
                            <div className="hidden md:block">
                                <table className="w-full">
                                    <caption className="sr-only">
                                        Your holdings with cost, live price, market value and profit or loss
                                    </caption>
                                    <thead>
                                        <tr className="border-b border-phosphor/20 bg-ink-raised">
                                            <th scope="col" className="px-4 py-2 text-left font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Stock
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Shares
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Cost
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Price
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Value
                                            </th>
                                            <th scope="col" className="px-4 py-2 text-right font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                P&amp;L
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolio.map((holding, index) => {
                                            const p = position(holding);
                                            return (
                                                <tr key={`${holding.ticker}-${index}`} className="data-row">
                                                    <td className="px-4 py-3">
                                                        <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                                                            {holding.ticker}
                                                        </span>
                                                        <span className="mt-1 block max-w-[14rem] truncate font-term text-xs text-phosphor-mid">
                                                            {p.name ?? "No longer listed"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                        {count(p.quantity)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-mid">
                                                        {money(p.buyPrice)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                        {p.currentPrice === null ? "—" : money(p.currentPrice)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-term text-sm text-phosphor-bright">
                                                        {p.marketValue === null ? "—" : money(p.marketValue)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-xs">
                                                        <Change absolute={p.gain} percent={p.gainPercent} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Stacked rows — below md */}
                            <ul className="md:hidden">
                                {portfolio.map((holding, index) => {
                                    const p = position(holding);
                                    return (
                                        <li
                                            key={`${holding.ticker}-${index}`}
                                            className="border-b border-phosphor/15 px-4 py-3.5 last:border-b-0"
                                        >
                                            <div className="flex items-baseline justify-between gap-3">
                                                <span className="border border-phosphor/30 bg-phosphor/10 px-1.5 py-0.5 font-term text-xs text-phosphor">
                                                    {holding.ticker}
                                                </span>
                                                <span className="font-term text-base text-phosphor-bright">
                                                    {p.marketValue === null ? "—" : money(p.marketValue)}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 flex items-baseline justify-between gap-3">
                                                <span className="min-w-0 truncate font-term text-xs text-phosphor-mid">
                                                    {count(p.quantity)} @ {money(p.buyPrice)} → {p.currentPrice === null ? "—" : money(p.currentPrice)}
                                                </span>
                                                <Change
                                                    absolute={p.gain}
                                                    percent={p.gainPercent}
                                                    className="shrink-0 text-xs"
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="flex items-baseline justify-between gap-4 border-t border-phosphor/25 bg-ink-raised px-4 py-3">
                                <span className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                    Total holdings value
                                </span>
                                <span className="font-term text-sm text-phosphor-bright">{money(portfolioValue)}</span>
                            </div>
                        </>
                    )}
                </Panel>

                <p className="font-term text-[11px] leading-relaxed text-phosphor-mid">
                    Cost is the price paid per share. P&amp;L compares it against the live market price and is
                    unrealised until the position is sold. {signedMoney(profitLoss)} is your return across the whole
                    account, cash included.
                </p>
            </div>
        </UserLayout>
    );
};

export default UserPortfolio;
