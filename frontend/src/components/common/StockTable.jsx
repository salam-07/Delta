import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Trash2, RefreshCw } from "lucide-react";
import { useMarketStore } from "../../store/useMarketStore";
import { useAdminStore } from "../../store/useAdminStore";

const StockTable = ({
    showActions = true,
    showDeleteColumn = true,
    showRefreshButton = true,
    title = "Stocks"
}) => {
    const [priceAdjustments, setPriceAdjustments] = useState({});

    // Get data and actions from stores
    const {
        stocks,
        isStocksLoading,
        fetchAllStocks
    } = useMarketStore();

    const {
        updateStock,
        deleteStock,
        updatingStock,
        deletingStockId
    } = useAdminStore();

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

    const handleDelete = async (stockId) => {
        if (window.confirm("Are you sure you want to delete this stock? This action cannot be undone.")) {
            await deleteStock(stockId);
        }
    };

    const handlePriceAdjustmentChange = (stockId, value) => {
        setPriceAdjustments(prev => ({
            ...prev,
            [stockId]: value
        }));
    };

    const getPriceAdjustmentValue = (stockId) => {
        return priceAdjustments[stockId] || 10; // Default to 10 if no custom value
    };

    const handlePriceIncrease = async (ticker, currentPrice, stockId) => {
        const adjustmentValue = getPriceAdjustmentValue(stockId);
        const newPrice = currentPrice + parseFloat(adjustmentValue);
        await updateStock(stockId, { newPrice });
    };

    const handlePriceDecrease = async (ticker, currentPrice, stockId) => {
        const adjustmentValue = getPriceAdjustmentValue(stockId);
        const newPrice = Math.max(0.01, currentPrice - parseFloat(adjustmentValue)); // Ensure price doesn't go below 0.01
        await updateStock(stockId, { newPrice });
    };

    return (
        <div className=" p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                {showRefreshButton && (
                    <button
                        onClick={fetchAllStocks}
                        disabled={isStocksLoading}
                        className="flex items-center gap-2 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} className={isStocksLoading ? "animate-spin" : ""} />
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
                    No stocks found. Create your first stock using the form above.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Ticker</th>
                                {showActions && (
                                    <th className="text-center text-gray-300 font-medium py-3 px-4">Price Actions</th>
                                )}
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Current Price</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Opening Price</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Change</th>
                                <th className="text-left text-gray-300 font-medium py-3 px-4">Company Name</th>
                                {showDeleteColumn && (
                                    <th className="text-left text-gray-300 font-medium py-3 px-4">Delete</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock._id} className="border-b border-gray-800 transition-colors">
                                    <td className="py-4 px-4">
                                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-mono">
                                            {stock.ticker}
                                        </span>
                                    </td>
                                    {showActions && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white p-1 rounded text-s font-semibold min-w-[30px] transition-colors"
                                                    title={`Increase Price by $${getPriceAdjustmentValue(stock._id)}`}
                                                    onClick={() => handlePriceIncrease(stock.ticker, stock.price, stock._id)}
                                                    disabled={updatingStock}
                                                >
                                                    {updatingStock ? (
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                                    ) : (
                                                        <ChevronUp className="size-3 m-auto" />
                                                    )}
                                                </button>
                                                <input
                                                    type="number"
                                                    value={getPriceAdjustmentValue(stock._id)}
                                                    onChange={(e) => handlePriceAdjustmentChange(stock._id, e.target.value)}
                                                    className="bg-transparent w-16 rounded px-1 py-1 text-white text-xs text-center focus:border-green-500 focus:outline-none"
                                                    min="0.1"
                                                    step="1"
                                                    placeholder="10"
                                                />
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white p-1 rounded text-xs font-semibold min-w-[30px] transition-colors"
                                                    title={`Decrease Price by $${getPriceAdjustmentValue(stock._id)}`}
                                                    onClick={() => handlePriceDecrease(stock.ticker, stock.price, stock._id)}
                                                    disabled={updatingStock}
                                                >
                                                    {updatingStock ? (
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                                    ) : (
                                                        <ChevronDown className="size-3 m-auto" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    <td className="py-4 px-4 text-left">
                                        <span className="text-green-400 font-semibold">
                                            ${stock.price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-left">
                                        <span className="text-gray-400 font-medium">
                                            ${stock.openingPrice ? stock.openingPrice.toFixed(2) : '0.00'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {renderPriceChange(stock)}
                                    </td>
                                    <td className="py-4 px-4 text-white">{stock.name}</td>

                                    {showDeleteColumn && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                                                    title="Delete Stock"
                                                    onClick={() => handleDelete(stock._id)}
                                                    disabled={deletingStockId === stock._id}
                                                >
                                                    {deletingStockId === stock._id ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StockTable;
