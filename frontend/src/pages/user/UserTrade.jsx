import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, TrendingDown as SellIcon } from 'lucide-react';
import UserLayout from '../../layouts/UserLayout';
import { useMarketStore } from '../../store/useMarketStore';
import { useTradeStore } from '../../store/useTradeStore';
import PriceChart from '../../components/PriceChart';

const UserTrade = () => {
    const [selectedStockId, setSelectedStockId] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [tradeAmount, setTradeAmount] = useState(1);
    const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
    const [companyInfo, setCompanyInfo] = useState('');

    const {
        stocks,
        history,
        fetchAllStocks,
        fetchStockHistory,
        fetchStockCompanyInfo,
        isStocksLoading,
        isHistoryLoading
    } = useMarketStore();

    const {
        balance,
        portfolio,
        buyStock,
        sellStock,
        checkBalance,
        viewPortfolio,
        isTrading
    } = useTradeStore();

    useEffect(() => {
        fetchAllStocks();
        checkBalance();
        viewPortfolio();
    }, [fetchAllStocks, checkBalance, viewPortfolio]);

    useEffect(() => {
        if (selectedStockId) {
            const stock = stocks.find(s => s._id === selectedStockId);
            setSelectedStock(stock);
            fetchStockHistory(selectedStockId);

            // Fetch company info
            fetchStockCompanyInfo(selectedStockId).then((data) => {
                setCompanyInfo(data.companyInfo || '');
            });
        }
    }, [selectedStockId, stocks, fetchStockHistory, fetchStockCompanyInfo]);

    const handleStockSelect = (e) => {
        const stockId = e.target.value;
        setSelectedStockId(stockId);
    };

    const handleTrade = async () => {
        if (!selectedStock || !tradeAmount || tradeAmount <= 0) {
            return;
        }

        try {
            if (tradeType === 'buy') {
                await buyStock(selectedStock.ticker, tradeAmount);
            } else {
                await sellStock(selectedStock.ticker, tradeAmount);
            }
            setTradeAmount(1);
        } catch (error) {
            console.error('Trade failed:', error);
        }
    };

    // Get user's holdings for the selected stock
    const getStockHoldings = () => {
        if (!selectedStock) return 0;
        const holding = portfolio.find(p => p.ticker === selectedStock.ticker);
        return holding ? parseFloat(holding.amount) : 0;
    };

    // Calculate trade value
    const getTradeValue = () => {
        if (!selectedStock || !tradeAmount) return 0;
        return selectedStock.price * tradeAmount;
    };

    // Get user's purchase price for P&L calculation
    const getUserPurchasePrice = () => {
        if (!selectedStock) return 0;
        const holding = portfolio.find(p => p.ticker === selectedStock.ticker);
        return holding ? parseFloat(holding.tradePrice) : 0;
    };

    // Calculate P&L for sell orders
    const getSellPnL = () => {
        if (tradeType !== 'sell' || !selectedStock || !tradeAmount) return 0;
        const purchasePrice = getUserPurchasePrice();
        const currentPrice = parseFloat(selectedStock.price);
        return (currentPrice - purchasePrice) * tradeAmount;
    };

    // Simplified price change calculation
    const calculatePriceChange = () => {
        if (!selectedStock) return { change: 0, percentage: 0 };

        const currentPrice = selectedStock.price || 0;
        const openingPrice = selectedStock.openingPrice || currentPrice;
        const change = currentPrice - openingPrice;
        const percentage = openingPrice > 0 ? (change / openingPrice) * 100 : 0;

        return { change, percentage };
    };

    const priceChange = calculatePriceChange();
    const openingPrice = selectedStock?.openingPrice || selectedStock?.price || 0;
    const stockHoldings = getStockHoldings();
    const tradeValue = getTradeValue();
    const sellPnL = getSellPnL();
    const purchasePrice = getUserPurchasePrice();

    return (
        <UserLayout title="Trade Stocks">
            <div className="space-y-6">
                {/* Stock Selector Dropdown */}
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                            <label htmlFor="stock-selector" className="block text-sm font-medium text-gray-400 mb-2">
                                Select Stock to Trade
                            </label>
                            <select
                                id="stock-selector"
                                value={selectedStockId}
                                onChange={handleStockSelect}
                                disabled={isStocksLoading}
                                className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full"
                            >
                                {isStocksLoading ? (
                                    <option value="">Loading stocks...</option>
                                ) : (
                                    <>
                                        <option value="">Select a stock...</option>
                                        {stocks.map((stock) => (
                                            <option key={stock._id} value={stock._id}>
                                                {stock.ticker} - {stock.name} (${stock.price?.toFixed(2)})
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                        {isStocksLoading && (
                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                </div>

                {selectedStock && (
                    <>
                        {/* Top Section - Price and Company Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left - Current Price */}
                            <div className="p-6">
                                <div className="text-center">
                                    <div className="text-6xl lg:text-8xl font-bold text-green-400 mb-2">
                                        ${selectedStock.price?.toFixed(2) || '0.00'}
                                    </div>
                                    <div className={`flex items-center justify-center gap-2 text-lg ${priceChange.change >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {priceChange.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                        <span>{priceChange.change >= 0 ? '+' : ''}${priceChange.change.toFixed(2)}</span>
                                        <span>({priceChange.change >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Company Info */}
                            <div className="p-6">
                                <div className="text-center lg:text-right">
                                    <div className="text-6xl lg:text-8xl font-bold text-white mb-2">
                                        {selectedStock.ticker}
                                    </div>
                                    <div className="text-2xl text-gray-300 mb-4">
                                        {selectedStock.name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trading Section */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Trade {selectedStock.ticker}</h3>

                            {/* Account Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 border border-green-400 rounded-lg">
                                    <div className="text-sm text-gray-400 mb-1">Account Balance</div>
                                    <div className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</div>
                                </div>
                                <div className="p-4 border border-green-400 rounded-lg">
                                    <div className="text-sm text-gray-400 mb-1">Current Holdings</div>
                                    <div className="text-2xl font-bold text-white">{stockHoldings} shares</div>
                                </div>
                            </div>

                            {/* Trade Type Selector */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setTradeType('buy')}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${tradeType === 'buy'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    Buy Order
                                </button>
                                <button
                                    onClick={() => setTradeType('sell')}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${tradeType === 'sell'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    disabled={stockHoldings === 0}
                                >
                                    Sell Order
                                </button>
                            </div>

                            {/* Trade Amount Input */}
                            <div className="mb-4">
                                <label htmlFor="trade-amount" className="block text-sm font-medium text-gray-400 mb-2">
                                    Number of Shares
                                </label>
                                <input
                                    id="trade-amount"
                                    type="number"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                                    min="1"
                                    max={tradeType === 'sell' ? stockHoldings : undefined}
                                    placeholder="Enter number of shares"
                                />
                            </div>

                            {/* Trade Summary */}
                            <div className="p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">Trade Value:</span>
                                    <span className="text-white font-semibold">${tradeValue.toFixed(2)}</span>
                                </div>
                                {tradeType === 'sell' && tradeAmount > 0 && purchasePrice > 0 && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">P&L:</span>
                                        <span className={`font-semibold ${sellPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {sellPnL >= 0 ? '+' : ''}${sellPnL.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">
                                        Balance After Trade:
                                    </span>
                                    <span className={`font-semibold ${tradeType === 'buy'
                                        ? (balance >= tradeValue ? 'text-green-400' : 'text-red-400')
                                        : 'text-green-400'
                                        }`}>
                                        ${tradeType === 'buy'
                                            ? (balance - tradeValue).toFixed(2)
                                            : (balance + tradeValue).toFixed(2)
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Trade Button */}
                            <button
                                onClick={handleTrade}
                                disabled={
                                    isTrading ||
                                    !tradeAmount ||
                                    tradeAmount <= 0 ||
                                    (tradeType === 'buy' && balance < tradeValue) ||
                                    (tradeType === 'sell' && tradeAmount > stockHoldings)
                                }
                                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-colors ${tradeType === 'buy'
                                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
                                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-800'
                                    } text-white disabled:cursor-not-allowed`}
                            >
                                {isTrading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {tradeType === 'buy' ? <ShoppingCart size={20} /> : <SellIcon size={20} />}
                                        {tradeType === 'buy' ? 'Buy' : 'Sell'} {tradeAmount} shares
                                    </>
                                )}
                            </button>

                            {/* Error Messages */}
                            {tradeType === 'buy' && balance < tradeValue && tradeAmount > 0 && (
                                <p className="text-red-400 text-sm mt-2">Insufficient balance to buy shares</p>
                            )}
                            {tradeType === 'sell' && tradeAmount > stockHoldings && (
                                <p className="text-red-400 text-sm mt-2">You don't own enough shares to sell</p>
                            )}
                        </div>

                        {/* Price Chart */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Price Chart</h3>
                            <PriceChart stockId={selectedStockId} height={300} />
                        </div>

                        {/* Company Info Section */}
                        {companyInfo && (
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Company Information</h3>
                                <div className=" p-4">
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {companyInfo}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Price Data */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="text-green-400" size={20} />
                                    <span className="text-gray-300">Opening Price</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${openingPrice.toFixed(2)}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {priceChange.change >= 0 ?
                                        <TrendingUp className="text-green-400" size={20} /> :
                                        <TrendingDown className="text-red-400" size={20} />
                                    }
                                    <span className="text-gray-300">Price Change</span>
                                </div>
                                <div className={`text-2xl font-bold ${priceChange.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {priceChange.change >= 0 ? '+' : ''}${priceChange.change.toFixed(2)}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingCart className="text-green-400" size={20} />
                                    <span className="text-gray-300">Your Current Holdings</span>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {stockHoldings} shares
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!selectedStock && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">Select a stock to start trading</div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default UserTrade;
