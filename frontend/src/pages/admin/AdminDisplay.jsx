
import React, { useEffect, useMemo } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useSocketStore } from '../../store/useSocketStore';

const AdminDisplay = () => {
    const { stocks, fetchAllStocks, marketOpen } = useMarketStore();
    const { analytics, users, getAnalytics, getAllUsers } = useAdminStore();
    const { onlineUsers } = useSocketStore();

    useEffect(() => {
        fetchAllStocks();
        getAnalytics();
        getAllUsers();
    }, [fetchAllStocks, getAnalytics, getAllUsers]);

    // Refresh users when stocks change for real-time net worth updates
    useEffect(() => {
        if (stocks && stocks.length > 0) {
            getAllUsers();
        }
    }, [stocks, getAllUsers]);

    // Memoized calculations for performance
    const { topStocks, leaderboard, onlineUsersCount } = useMemo(() => ({
        topStocks: stocks
            ?.sort((a, b) => b.price - a.price)
            .slice(0, 8) || [],

        leaderboard: users
            ?.filter(user => user.role !== 'admin')
            .map(user => ({
                name: user.fullName,
                assets: (user.balance || 0) + (user.portfolio || []).reduce((sum, stock) => {
                    const current = stocks?.find(s => s.ticker === stock.ticker);
                    return sum + (current?.price || 0) * (stock.amount || 0);
                }, 0)
            }))
            .sort((a, b) => b.assets - a.assets)
            .slice(0, 6) || [],

        onlineUsersCount: onlineUsers.length
    }), [stocks, users, onlineUsers]);

    const formatCurrency = (amount) => `$${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
    const formatChange = (stock) => {
        const change = (stock.price - stock.openingPrice) || 0;
        const percent = stock.openingPrice > 0 ? (change / stock.openingPrice) * 100 : 0;
        return { change, percent };
    };

    return (
        <div className="mt-16 min-h-screen bg-black text-white font-mono overflow-hidden">
            {/* Header */}
            <div className="bg-green-900/30 border-b-2 border-green-400 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-4xl font-bold text-green-400 tracking-wider">DELTA TRADING</h1>
                    <div className={`flex items-center gap-2 text-2xl font-bold ${marketOpen ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-4 h-4 rounded-full ${marketOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                        {marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-green-400 text-xl">USERS ONLINE</div>
                    <div className="text-4xl font-bold">{onlineUsersCount}</div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-120px)]">
                {/* Stocks Panel - 60% */}
                <div className="w-3/5 p-6 border-r-2 border-green-400/30">
                    <h2 className="text-2xl font-bold text-green-400 mb-4 tracking-wider">MARKET PRICES</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {topStocks.map(stock => {
                            const { change, percent } = formatChange(stock);
                            const isPositive = change >= 0;
                            return (
                                <div key={stock.ticker} className="bg-green-900/10 border border-green-400/20 p-4 rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="text-2xl font-bold text-green-400">{stock.ticker}</div>
                                            <div className="text-sm text-white/60 truncate">{stock.name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold">{formatCurrency(stock.price)}</div>
                                            <div className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                {isPositive ? '+' : ''}{formatCurrency(change)} ({percent.toFixed(2)}%)
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}
                                            style={{ width: `${Math.min(100, Math.abs(percent) * 10)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard Panel - 40% */}
                <div className="w-2/5 p-6">
                    <h2 className="text-2xl font-bold text-green-400 mb-4 tracking-wider">TOP INVESTORS</h2>
                    <div className="space-y-3">
                        {leaderboard.map((user, index) => (
                            <div key={user.name} className="bg-green-900/10 border border-green-400/20 p-4 rounded flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg
                                        ${index === 0 ? 'bg-yellow-400 text-black' :
                                            index === 1 ? 'bg-gray-300 text-black' :
                                                index === 2 ? 'bg-orange-400 text-black' : 'bg-green-400/20 text-green-400'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="text-xl font-medium">{user.name}</div>
                                </div>
                                <div className="text-2xl font-bold text-green-400">{formatCurrency(user.assets)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDisplay;