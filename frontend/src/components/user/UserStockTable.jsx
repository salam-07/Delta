import { useState, useEffect } from "react";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { useMarketStore } from "../../store/useMarketStore";
import { useTradeStore } from "../../store/useTradeStore";

const UserStockTable = ({
    showRefreshButton = true,
    title = "Market Stocks"
}) => {
    const [shareAmounts, setShareAmounts] = useState({});

    // Get data and actions from stores
    const {
        stocks,
        isStocksLoading,
        fetchAllStocks
    } = useMarketStore();

    const {
        buyStock,
        sellStock,
        isTrading
    } = useTradeStore();

    // Fetch stocks on component mount
    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    // Simple function to calculate price change using openingPrice and current price
    const calculatePriceChange = (stock) => {
        const openingPrice = parseFloat(stock.openingPrice) || 0;
        const currentPrice = parseFloat(stock.price) || 0;

        const priceChange = currentPrice - openingPrice;
        const percentageChange = openingPrice > 0 ? ((priceChange / openingPrice) * 100) : 0;

        return {
            priceChange: priceChange.toFixed(2),
            percentageChange: percentageChange.toFixed(2),
            isPositive: priceChange >= 0
        };
    };

    // Function to render price change
    const renderPriceChange = (stock) => {
        const { priceChange, percentageChange, isPositive } = calculatePriceChange(stock);
        const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
        const sign = isPositive ? '+' : '';

        return (
            <div className={`${colorClass} text-sm`}>
                <div>{sign}${priceChange}</div>
                <div>({sign}{percentageChange}%)</div>
            </div>
        );
    };

    const handleShareAmountChange = (stockId, value) => {
        setShareAmounts(prev => ({
            ...prev,
            [stockId]: value
        }));
    };

    const getShareAmount = (stockId) => {
        return shareAmounts[stockId] || 1; // Default to 1 share
    };

    const handleBuyStock = async (ticker, stockId) => {
        const shares = getShareAmount(stockId);
        if (shares > 0) {
            await buyStock(ticker, shares);
        }
    };

    const handleSellStock = async (ticker, stockId) => {
        const shares = getShareAmount(stockId);
        if (shares > 0) {
            await sellStock(ticker, shares);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {showRefreshButton && (
                    <button
                        onClick={fetchAllStocks}
                        disabled={isStocksLoading}
                        className="flex items-center gap-2 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg transition-colors hover:bg-gray-800/50"
                    >
                        <TrendingUp size={16} className={isStocksLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                )}
            </div>

            {isStocksLoading && stocks.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Loading stocks...
                    </div>
                </div>
            ) : stocks.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                    No stocks available for trading.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Ticker</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Company Name</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Current Price</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Change</th>
                                <th className="text-center text-gray-300 font-medium py-3 px-4">Trade Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <td className="py-4 px-4">
                                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-mono">
                                            {stock.ticker}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-white">
                                        {stock.name}
                                    </td>
                                    <td className="py-4 px-4 text-left">
                                        <span className="text-green-400 font-semibold">
                                            ${stock.price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {renderPriceChange(stock)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white p-2 rounded text-sm font-semibold min-w-[60px] transition-colors flex items-center justify-center gap-1"
                                                title={`Buy ${getShareAmount(stock._id)} shares`}
                                                onClick={() => handleBuyStock(stock.ticker, stock._id)}
                                                disabled={isTrading}
                                            >
                                                {isTrading ? (
                                                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={14} />
                                                        Buy
                                                    </>
                                                )}
                                            </button>
                                            <input
                                                type="number"
                                                value={getShareAmount(stock._id)}
                                                onChange={(e) => handleShareAmountChange(stock._id, parseInt(e.target.value) || 1)}
                                                className="bg-gray-700 border border-gray-600 w-20 rounded px-2 py-2 text-white text-sm text-center focus:border-green-500 focus:outline-none"
                                                min="1"
                                                step="1"
                                                placeholder="1"
                                            />
                                            <button
                                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white p-2 rounded text-sm font-semibold min-w-[60px] transition-colors flex items-center justify-center gap-1"
                                                title={`Sell ${getShareAmount(stock._id)} shares`}
                                                onClick={() => handleSellStock(stock.ticker, stock._id)}
                                                disabled={isTrading}
                                            >
                                                {isTrading ? (
                                                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <TrendingUp size={14} />
                                                        Sell
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserStockTable;
