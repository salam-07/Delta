import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import UserLayout from '../../layouts/UserLayout';
import { useTradeStore } from '../../store/useTradeStore';

const UserHistory = () => {
    const { tradeHistory, isLoadingHistory, viewHistory } = useTradeStore();
    const [visibleTrades, setVisibleTrades] = useState(20); // For lazy loading

    useEffect(() => {
        viewHistory();
    }, [viewHistory]);

    // Format trade data for display
    const formatTradeText = (trade) => {
        const stockTicker = trade.stockId?.ticker || trade.ticker || 'Unknown Stock';
        const tradeType = trade.type?.toLowerCase() === 'buy' ? 'Bought' : 'Sold';
        const amount = trade.amount || 0;
        const price = trade.tradePrice || 0;

        return `${tradeType} ${amount} shares of ${stockTicker} at $${price.toFixed(2)}`;
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
        <UserLayout title="My Trade History">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Trade History</h1>
                        <p className="text-white/60 mt-1">Your complete trading activity</p>
                    </div>

                    <button
                        onClick={viewHistory}
                        disabled={isLoadingHistory}
                        className="flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all duration-200"
                    >
                        <RefreshCw size={16} className={isLoadingHistory ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Total Trades Counter */}
                <div className="text-center py-8">
                    <div className="text-8xl font-bold text-green-400 mb-4">
                        {isLoadingHistory ? (
                            <div className="w-32 h-24 bg-black/20 animate-pulse rounded-lg mx-auto"></div>
                        ) : (
                            tradeHistory.length.toLocaleString()
                        )}
                    </div>
                    <p className="text-xl text-white/60">
                        Your Total Trades
                    </p>
                </div>

                {/* Trade History List */}
                <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 rounded-lg overflow-hidden">
                    {isLoadingHistory && tradeHistory.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                            <span className="ml-3 text-white/60">Loading your trade history...</span>
                        </div>
                    ) : tradeHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No Trades Yet</h3>
                            <p className="text-white/60">Your trading history will appear here once you make your first trade</p>
                        </div>
                    ) : (
                        <>
                            {/* Trade List */}
                            <div className="p-6 space-y-4">
                                {tradeHistory.slice(0, visibleTrades).map((trade, index) => (
                                    <div
                                        key={trade._id || index}
                                        className="flex items-center justify-between p-4 bg-black/10 rounded-lg border border-green-500/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Trade Type Icon */}
                                            <div className={`p-2 rounded-full ${trade.type?.toLowerCase() === 'buy'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-white/20 text-white/60'
                                                }`}>
                                                {trade.type?.toLowerCase() === 'buy' ? (
                                                    <TrendingUp size={20} />
                                                ) : (
                                                    <TrendingDown size={20} />
                                                )}
                                            </div>

                                            {/* Trade Details */}
                                            <div>
                                                <p className="text-white font-medium text-lg">
                                                    {formatTradeText(trade)}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    Total Value: ${((trade.tradePrice || 0) * (trade.amount || 0)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="text-right">
                                            <p className="text-white/60 text-sm">
                                                {formatDate(trade.createdAt || trade.date)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {visibleTrades < tradeHistory.length && (
                                <div className="border-t border-green-500/20 p-6 text-center">
                                    <button
                                        onClick={loadMoreTrades}
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-6 py-3 rounded-lg transition-all duration-200"
                                    >
                                        Load More Trades ({tradeHistory.length - visibleTrades} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Summary Stats */}
                {!isLoadingHistory && tradeHistory.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-green-400" size={20} />
                                <span className="text-sm font-medium text-white/70">Buy Orders</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                                {tradeHistory.filter(t => t.type?.toLowerCase() === 'buy').length}
                            </div>
                        </div>

                        <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="text-white/60" size={20} />
                                <span className="text-sm font-medium text-white/70">Sell Orders</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {tradeHistory.filter(t => t.type?.toLowerCase() === 'sell').length}
                            </div>
                        </div>

                        <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-green-400" size={20} />
                                <span className="text-sm font-medium text-white/70">Total Volume</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                                ${tradeHistory.reduce((sum, trade) => sum + ((trade.tradePrice || 0) * (trade.amount || 0)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="text-green-400" size={20} />
                                <span className="text-sm font-medium text-white/70">Avg. Trade Size</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${tradeHistory.length > 0 ? (tradeHistory.reduce((sum, trade) => sum + ((trade.tradePrice || 0) * (trade.amount || 0)), 0) / tradeHistory.length).toFixed(2) : '0.00'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default UserHistory;