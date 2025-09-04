import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Edit3, ChevronUp, ChevronDown } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useMarketStore } from '../../store/useMarketStore';
import { useAdminStore } from '../../store/useAdminStore';
import PriceChart from '../../components/PriceChart';

const AdminStockView = () => {
    const { stockId } = useParams();
    const navigate = useNavigate();
    const [priceAdjustment, setPriceAdjustment] = useState(10);

    const {
        stock,
        stocks,
        history,
        fetchStock,
        fetchStockHistory,
        fetchAllStocks,
        isStockLoading,
        isHistoryLoading,
        isStocksLoading
    } = useMarketStore();

    const { updateStock, updatingStock } = useAdminStore();

    useEffect(() => {
        if (stockId) {
            fetchStock(stockId);
            fetchStockHistory(stockId);
        }
    }, [stockId, fetchStock, fetchStockHistory]);

    // Fetch all stocks for dropdown
    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const handleStockSelect = (e) => {
        const selectedStockId = e.target.value;
        if (selectedStockId && selectedStockId !== stockId) {
            navigate(`/admin/stocks/${selectedStockId}`);
        }
    };

    const handlePriceIncrease = async () => {
        const newPrice = stock.price + parseFloat(priceAdjustment);
        await updateStock(stockId, { newPrice });
        // Refresh data
        fetchStock(stockId);
        fetchStockHistory(stockId);
    };

    const handlePriceDecrease = async () => {
        const newPrice = Math.max(0.01, stock.price - parseFloat(priceAdjustment)); // Ensure price doesn't go below 0.01
        await updateStock(stockId, { newPrice });
        // Refresh data
        fetchStock(stockId);
        fetchStockHistory(stockId);
    };

    // Simplified price change calculation using stock object properties
    const calculatePriceChange = () => {
        if (!stock) return { change: 0, percentage: 0 };

        const currentPrice = stock.price || 0;
        const openingPrice = stock.openingPrice || currentPrice;
        const change = currentPrice - openingPrice;
        const percentage = openingPrice > 0 ? (change / openingPrice) * 100 : 0;

        return { change, percentage };
    };

    const priceChange = calculatePriceChange();
    const openingPrice = stock?.openingPrice || stock?.price || 0;

    if (isStockLoading) {
        return (
            <AdminLayout title="Stock Details">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (!stock) {
        return (
            <AdminLayout title="Stock Details">
                <div className="text-center text-gray-400 mt-8">
                    Stock not found
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title={`${stock.ticker} - Stock Details`}>
            <div className="space-y-6">
                {/* Stock Selector Dropdown */}
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <select
                            id="stock-selector"
                            value={stockId}
                            onChange={handleStockSelect}
                            disabled={isStocksLoading}
                            className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex-1 max-w-md"
                        >
                            {isStocksLoading ? (
                                <option value="">Loading stocks...</option>
                            ) : (
                                <>
                                    <option value="">Select a stock...</option>
                                    {stocks.map((stockOption) => (
                                        <option key={stockOption._id} value={stockOption._id}>
                                            {stockOption.ticker} - {stockOption.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {isStocksLoading && (
                            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        )}
                    </div>
                </div>
                {/* Top Section - Price and Company Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left - Current Price */}
                    <div className="p-6">
                        <div className="text-center">
                            <div className="text-6xl lg:text-8xl font-bold text-green-400 mb-2">
                                ${stock.price?.toFixed(2) || '0.00'}
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
                            <div className=" text-6xl lg:text-8xl font-bold text-white mb-2">
                                {stock.ticker}
                            </div>
                            <div className="text-2xl text-gray-300 mb-4">
                                {stock.name}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Update Section */}
                <div className="p-6">


                    <div className="flex items-center justify-center gap-4 flex-col md:flex-row">
                        <button
                            onClick={handlePriceIncrease}
                            disabled={updatingStock}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                            title={`Increase Price by $${priceAdjustment}`}
                        >
                            {updatingStock ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ChevronUp size={20} />
                            )}
                            Increase by ${priceAdjustment}
                        </button>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={priceAdjustment}
                                    onChange={(e) => setPriceAdjustment(e.target.value)}
                                    className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-center w-20 focus:border-green-500 focus:outline-none"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="10"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handlePriceDecrease}
                            disabled={updatingStock}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                            title={`Decrease Price by $${priceAdjustment}`}
                        >
                            {updatingStock ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                            Decrease by ${priceAdjustment}
                        </button>
                    </div>

                    <div className="mt-4 text-center text-gray-400 text-sm">
                        Current Price: <span className="text-green-400 font-semibold">${stock?.price?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>

                {/* Price Chart */}
                <div className="p-6">
                    <PriceChart stockId={stockId} height={300} />
                </div>

                {/* Price Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="text-blue-400" size={20} />
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
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminStockView;
