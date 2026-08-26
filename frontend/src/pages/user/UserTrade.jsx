import { useState, useEffect } from 'react';
import { ChartLine } from 'lucide-react';
import UserLayout from '../../layouts/UserLayout';
import { useMarketStore } from '../../store/useMarketStore';
import { useTradeStore } from '../../store/useTradeStore';
import PriceChart from '../../components/PriceChart';
import { Panel, PanelHeader } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { SelectField, TextField } from '../../components/ui/Field';
import { Change, Readout, ReadoutStrip } from '../../components/ui/Readout';
import { EmptyState } from '../../components/ui/Feedback';
import { count, money, priceChange, signedMoney } from '../../lib/format';

/**
 * The order ticket. One instrument at a time: its quote at the top, the ticket
 * and its consequences on the left, the price record on the right.
 *
 * Every figure the participant needs to decide — cash, holdings, order value,
 * realised P&L, resulting balance — is stated before the order can be placed,
 * and the button that places it is disabled with a named reason when it cannot.
 */
const UserTrade = () => {
    const [selectedStockId, setSelectedStockId] = useState('');
    const [tradeAmount, setTradeAmount] = useState(1);
    const [tradeType, setTradeType] = useState('buy');
    const [companyInfo, setCompanyInfo] = useState('');

    const { stocks, fetchAllStocks, fetchStockHistory, fetchStockCompanyInfo, isStocksLoading } = useMarketStore();
    const { balance, portfolio, buyStock, sellStock, checkBalance, viewPortfolio, isTrading } = useTradeStore();

    useEffect(() => {
        fetchAllStocks();
        checkBalance();
        viewPortfolio();
    }, [fetchAllStocks, checkBalance, viewPortfolio]);

    /**
     * History and company info are fetched only when the instrument changes.
     * Keying this on `stocks` refetched both on every socket price tick.
     */
    useEffect(() => {
        if (!selectedStockId) {
            setCompanyInfo('');
            return;
        }
        setTradeType('buy');
        setTradeAmount(1);
        fetchStockHistory(selectedStockId);

        let active = true;
        fetchStockCompanyInfo(selectedStockId).then((data) => {
            if (active) setCompanyInfo(data?.companyInfo || '');
        });
        return () => {
            active = false;
        };
    }, [selectedStockId, fetchStockHistory, fetchStockCompanyInfo]);

    // Derived from the live list, so the quote stays current without an effect.
    const selectedStock = stocks.find((s) => s._id === selectedStockId) ?? null;
    const holding = selectedStock ? portfolio.find((p) => p.ticker === selectedStock.ticker) : null;
    const stockHoldings = holding ? parseFloat(holding.amount) : 0;
    const purchasePrice = holding ? parseFloat(holding.tradePrice) : 0;

    const change = priceChange(selectedStock);
    const tradeValue = selectedStock && tradeAmount > 0 ? selectedStock.price * tradeAmount : 0;
    const sellPnL =
        tradeType === 'sell' && selectedStock && tradeAmount > 0 && purchasePrice > 0
            ? (parseFloat(selectedStock.price) - purchasePrice) * tradeAmount
            : null;
    const balanceAfter = tradeType === 'buy' ? balance - tradeValue : balance + tradeValue;

    const insufficientCash = tradeType === 'buy' && tradeAmount > 0 && balance < tradeValue;
    const insufficientShares = tradeType === 'sell' && tradeAmount > stockHoldings;
    const blockedReason = insufficientCash
        ? 'Not enough cash for this order.'
        : insufficientShares
            ? `You hold ${count(stockHoldings)} ${stockHoldings === 1 ? 'share' : 'shares'} of ${selectedStock?.ticker}.`
            : null;

    const handleTrade = async () => {
        if (!selectedStock || !(tradeAmount > 0) || blockedReason) return;
        await (tradeType === 'buy' ? buyStock : sellStock)(selectedStock.ticker, tradeAmount);
        setTradeAmount(1);
    };

    return (
        <UserLayout title="Trade">
            <div className="space-y-6">
                <Panel>
                    <PanelHeader label="Instrument" />
                    <div className="px-4 py-4">
                        <SelectField
                            label="Stock"
                            value={selectedStockId}
                            onChange={(e) => setSelectedStockId(e.target.value)}
                            disabled={isStocksLoading}
                            containerClassName="max-w-md"
                        >
                            {isStocksLoading ? (
                                <option value="">Loading stocks…</option>
                            ) : (
                                <>
                                    <option value="">Select a stock…</option>
                                    {stocks.map((stock) => (
                                        <option key={stock._id} value={stock._id}>
                                            {stock.ticker} — {stock.name} ({money(stock.price)})
                                        </option>
                                    ))}
                                </>
                            )}
                        </SelectField>
                    </div>

                    {selectedStock ? (
                        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-phosphor/20 px-4 py-5">
                            <div className="min-w-0">
                                <div className="font-board text-3xl tracking-cell text-phosphor">
                                    {selectedStock.ticker}
                                </div>
                                <div className="mt-1 truncate font-term text-sm text-phosphor-mid">
                                    {selectedStock.name}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-term text-4xl text-phosphor-bright">
                                    {money(selectedStock.price)}
                                </div>
                                <div className="mt-1.5 flex items-center justify-end gap-4">
                                    <Change
                                        absolute={change.absolute}
                                        percent={change.percent}
                                        size="lg"
                                        className="text-sm"
                                    />
                                    <span className="font-term text-xs text-phosphor-mid">
                                        Open {money(selectedStock.openingPrice ?? selectedStock.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </Panel>

                {!selectedStock ? (
                    <Panel>
                        <EmptyState
                            icon={ChartLine}
                            label="No instrument selected"
                            description="Choose a stock above to see its price record and place an order."
                        />
                    </Panel>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Panel ticks className="self-start">
                            <PanelHeader label={`Order — ${selectedStock.ticker}`} />

                            <ReadoutStrip cols={2} className="border-b border-phosphor/20">
                                <Readout label="Cash" value={money(balance)} size="sm" />
                                <Readout
                                    label="Holdings"
                                    value={`${count(stockHoldings)} ${stockHoldings === 1 ? 'share' : 'shares'}`}
                                    size="sm"
                                />
                            </ReadoutStrip>

                            <div className="space-y-5 px-4 py-5">
                                <div role="group" aria-label="Order side" className="flex gap-px bg-phosphor/15">
                                    <button
                                        onClick={() => setTradeType('buy')}
                                        aria-pressed={tradeType === 'buy'}
                                        className={`flex-1 py-2.5 font-term text-[11px] uppercase tracking-label transition-colors
                                            ${tradeType === 'buy'
                                                ? 'bg-signal-up/20 text-signal-up'
                                                : 'bg-ink-raised text-phosphor-mid hover:bg-phosphor/5 hover:text-phosphor-bright'}`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => setTradeType('sell')}
                                        aria-pressed={tradeType === 'sell'}
                                        disabled={stockHoldings === 0}
                                        title={stockHoldings === 0 ? `You hold no shares of ${selectedStock.ticker}` : undefined}
                                        className={`flex-1 py-2.5 font-term text-[11px] uppercase tracking-label transition-colors
                                            disabled:cursor-not-allowed disabled:bg-ink-raised disabled:text-phosphor-mid/40
                                            ${tradeType === 'sell'
                                                ? 'bg-signal-down/20 text-signal-down'
                                                : 'bg-ink-raised text-phosphor-mid hover:bg-phosphor/5 hover:text-phosphor-bright'}`}
                                    >
                                        Sell
                                    </button>
                                </div>

                                <TextField
                                    label="Shares"
                                    type="number"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                                    min="1"
                                    max={tradeType === 'sell' ? stockHoldings : undefined}
                                    placeholder="0"
                                    hint={
                                        tradeType === 'sell'
                                            ? `Up to ${count(stockHoldings)} available`
                                            : `Up to ${count(Math.floor(balance / (selectedStock.price || 1)))} affordable at this price`
                                    }
                                />

                                <dl className="panel-inset divide-y divide-phosphor/10 px-3.5">
                                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                                        <dt className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Order value
                                        </dt>
                                        <dd className="font-term text-sm text-phosphor-bright">{money(tradeValue)}</dd>
                                    </div>
                                    {sellPnL !== null ? (
                                        <div className="flex items-baseline justify-between gap-4 py-2.5">
                                            <dt className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                                Realised P&amp;L
                                            </dt>
                                            <dd
                                                className={`font-term text-sm ${sellPnL >= 0 ? 'text-signal-up' : 'text-signal-down'}`}
                                            >
                                                {signedMoney(sellPnL)}
                                            </dd>
                                        </div>
                                    ) : null}
                                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                                        <dt className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">
                                            Cash after
                                        </dt>
                                        <dd
                                            className={`font-term text-sm ${balanceAfter < 0 ? 'text-signal-down' : 'text-phosphor-bright'}`}
                                        >
                                            {money(balanceAfter)}
                                        </dd>
                                    </div>
                                </dl>

                                <div>
                                    <Button
                                        size="lg"
                                        variant={tradeType === 'buy' ? 'buy' : 'sell'}
                                        className="w-full"
                                        onClick={handleTrade}
                                        loading={isTrading}
                                        disabled={!tradeAmount || tradeAmount <= 0 || Boolean(blockedReason)}
                                    >
                                        {tradeType === 'buy' ? 'Buy' : 'Sell'} {count(tradeAmount)}{' '}
                                        {tradeAmount === 1 ? 'share' : 'shares'}
                                    </Button>
                                    {blockedReason ? (
                                        <p role="alert" className="mt-2 font-term text-xs text-signal-down">
                                            {blockedReason}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </Panel>

                        <div className="space-y-6">
                            <Panel>
                                <PanelHeader label="Price record" />
                                <div className="px-2 py-4">
                                    <PriceChart stockId={selectedStockId} height={300} />
                                </div>
                            </Panel>

                            {companyInfo ? (
                                <Panel>
                                    <PanelHeader label="Company" />
                                    <p className="whitespace-pre-wrap px-4 py-4 font-term text-xs leading-relaxed text-phosphor-bright">
                                        {companyInfo}
                                    </p>
                                </Panel>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default UserTrade;
