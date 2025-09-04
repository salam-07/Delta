import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Edit3, Minus, Plus } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useMarketStore } from '../../store/useMarketStore';
import { useAdminStore } from '../../store/useAdminStore';
import PriceChart from '../../components/PriceChart';

const AdminStockView = () => {
    const { stockId } = useParams();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateData, setUpdateData] = useState({
        price: '',
        change: ''
    });

    const {
        stock,
        history,
        fetchStock,
        fetchStockHistory,
        isStockLoading,
        isHistoryLoading
    } = useMarketStore();

    const { updateStockPrice, updatingStock } = useAdminStore();

    useEffect(() => {
        if (stockId) {
            fetchStock(stockId);
            fetchStockHistory(stockId);
        }
    }, [stockId, fetchStock, fetchStockHistory]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!updateData.price) return;

        await updateStockPrice(stockId, {
            price: parseFloat(updateData.price),
            change: updateData.change ? parseFloat(updateData.change) : 0
        });

        // Reset form and refresh data
        setUpdateData({ price: '', change: '' });
        setShowUpdateForm(false);
        fetchStock(stockId);
        fetchStockHistory(stockId);
    };

    const calculatePriceChange = () => {
        if (!history || history.length < 2) return { change: 0, percentage: 0 };

        const currentPrice = history[history.length - 1]?.price || stock?.price || 0;
        const previousPrice = history[history.length - 2]?.price || currentPrice;
        const change = currentPrice - previousPrice;
        const percentage = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

        return { change, percentage };
    };

    const getOpeningPrice = () => {
        if (!history || history.length === 0) return stock?.price || 0;
        return history[0]?.price || stock?.price || 0;
    };

    const priceChange = calculatePriceChange();
    const openingPrice = getOpeningPrice();

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
                {/* Top Section - Price and Company Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left - Current Price */}
                    <div className="bg-gray-800/30 rounded-lg p-6">
                        <div className="text-center">
                            <div className="text-6xl font-bold text-green-400 mb-2">
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
                    <div className="bg-gray-800/30 rounded-lg p-6">
                        <div className="text-right">
                            <div className="text-4xl font-bold text-white mb-2">
                                {stock.ticker}
                            </div>
                            <div className="text-xl text-gray-300 mb-4">
                                {stock.name}
                            </div>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div>Market Status: <span className="text-green-400">Active</span></div>
                                <div>Last Updated: {new Date(stock.updatedAt).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Chart */}
                <div className="bg-gray-800/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Price History</h3>
                    {isHistoryLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <PriceChart stockId={stockId} height={300} />
                    )}
                </div>

                {/* Price Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="text-blue-400" size={20} />
                            <span className="text-gray-300">Opening Price</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            ${openingPrice.toFixed(2)}
                        </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-lg p-4">
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

                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Edit3 className="text-purple-400" size={20} />
                            <span className="text-gray-300">Total Trades</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {history?.length || 0}
                        </div>
                    </div>
                </div>

                {/* Price Update Section */}
                <div className="bg-gray-800/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Price Management</h3>
                        <button
                            onClick={() => setShowUpdateForm(!showUpdateForm)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Edit3 size={16} />
                            Update Price
                        </button>
                    </div>

                    {showUpdateForm && (
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={updateData.price}
                                        onChange={(e) => setUpdateData(prev => ({ ...prev, price: e.target.value }))}
                                        placeholder={stock.price?.toFixed(2)}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Price Change ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={updateData.change}
                                        onChange={(e) => setUpdateData(prev => ({ ...prev, change: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={updatingStock}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {updatingStock ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Update Price
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUpdateForm(false);
                                        setUpdateData({ price: '', change: '' });
                                    }}
                                    className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminStockView;
