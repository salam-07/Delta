import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminStore } from '../../store/useAdminStore';

const AdminTrades = () => {
    const { tradeHistory, isTradeHistoryLoading, getTradeHistory } = useAdminStore();
    const [visibleTrades, setVisibleTrades] = useState(20); // For lazy loading

    useEffect(() => {
        getTradeHistory();
    }, [getTradeHistory]);

    // Format trade data for display
    const formatTradeText = (trade) => {
        const traderName = trade.traderId?.fullName || trade.traderId?.name || 'Unknown User';
        const stockTicker = trade.stockId?.ticker || trade.ticker || 'Unknown Stock';
        const tradeType = trade.type?.toLowerCase() === 'buy' ? 'bought' : 'sold';
        const amount = trade.amount || 0;
        const price = trade.tradePrice || 0;

        return `${traderName} ${tradeType} (${amount}) ${stockTicker} at $${price.toFixed(2)}`;
    };

    // Load more trades (lazy loading)
    const loadMoreTrades = () => {
        setVisibleTrades(prev => prev + 20);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Trade History">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Trade History</h1>
                        <p className="text-gray-400 mt-1">Complete history of all trades in the system</p>
                    </div>

                    <button
                        onClick={getTradeHistory}
                        disabled={isTradeHistoryLoading}
                        className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} className={isTradeHistoryLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Total Trades Counter */}
                <div className="text-center py-8">
                    <div className="text-8xl font-bold text-white mb-4">
                        {isTradeHistoryLoading ? (
                            <div className="w-32 h-24 bg-gray-700 animate-pulse rounded-lg mx-auto"></div>
                        ) : (
                            tradeHistory.length.toLocaleString()
                        )}
                    </div>
                    <p className="text-xl text-gray-400">
                        Total Trades Executed
                    </p>
                </div>

                {/* Trade History List */}
                <div className="overflow-hidden">
                    {isTradeHistoryLoading && tradeHistory.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span className="ml-3 text-gray-400">Loading trade history...</span>
                        </div>
                    ) : tradeHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No Trades Yet</h3>
                            <p className="text-gray-500">Trade history will appear here once users start trading</p>
                        </div>
                    ) : (
                        <>
                            {/* Trade List */}
                            <div className="p-6 space-y-4">
                                {tradeHistory.slice(0, visibleTrades).map((trade, index) => (
                                    <div
                                        key={trade._id || index}
                                        className="flex items-center justify-between p-2"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Trade Type Icon */}
                                            <div className={`p-2 rounded-full ${trade.type?.toLowerCase() === 'buy'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {trade.type?.toLowerCase() === 'buy' ? (
                                                    <TrendingUp size={20} />
                                                ) : (
                                                    <TrendingDown size={20} />
                                                )}
                                            </div>

                                            {/* Trade Text */}
                                            <div>
                                                <p className="text-white font-medium text-md">
                                                    {formatTradeText(trade)}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Total Value: ${((trade.tradePrice || 0) * (trade.amount || 0)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm">
                                                {formatDate(trade.createdAt || trade.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {visibleTrades < tradeHistory.length && (
                                <div className="border-t border-gray-700 p-6 text-center">
                                    <button
                                        onClick={loadMoreTrades}
                                        className="bg-green-800 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Load More Trades ({tradeHistory.length - visibleTrades} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Summary Stats */}
                {!isTradeHistoryLoading && tradeHistory.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className=" rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-green-400" size={20} />
                                <span className="text-sm font-medium text-gray-400">Buy Orders</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                                {tradeHistory.filter(t => t.type?.toLowerCase() === 'buy').length}
                            </div>
                        </div>

                        <div className=" rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="text-red-400" size={20} />
                                <span className="text-sm font-medium text-gray-400">Sell Orders</span>
                            </div>
                            <div className="text-2xl font-bold text-red-400">
                                {tradeHistory.filter(t => t.type?.toLowerCase() === 'sell').length}
                            </div>
                        </div>

                        <div className=" rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-blue-400" size={20} />
                                <span className="text-sm font-medium text-gray-400">Total Volume</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${tradeHistory.reduce((sum, trade) => sum + ((trade.tradePrice || 0) * (trade.amount || 0)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className=" rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-yellow-400" size={20} />
                                <span className="text-sm font-medium text-gray-400">Avg. Trade Size</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${tradeHistory.length > 0 ? (tradeHistory.reduce((sum, trade) => sum + ((trade.tradePrice || 0) * (trade.amount || 0)), 0) / tradeHistory.length).toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminTrades;