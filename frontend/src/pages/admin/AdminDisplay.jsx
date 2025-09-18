
import React, { useEffect, useMemo, useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useSocketStore } from '../../store/useSocketStore';

const AdminDisplay = () => {
    const { stocks, fetchAllStocks, marketOpen } = useMarketStore();
    const { analytics, users, getAnalytics, getAllUsers } = useAdminStore();
    const { onlineUsers } = useSocketStore();

    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Add marquee animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            .animate-marquee {
                animation: marquee 60s linear infinite;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

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
            .slice(0, 10) || [],

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
            <div className="bg-green-900/30 border-b-2 border-green-400 px-8 py-1 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-4xl font-bold text-green-400 tracking-wider">DELTA TRADING FLOOR</h1>
                    <div className={`flex items-center gap-2 text-2xl font-bold ${marketOpen ? 'text-green-400' : 'text-red-400'}`}>
                        <div className={`w-4 h-4 rounded-full ${marketOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                        {marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-green-400 text-lg">USERS LIVE</div>
                    <div className="text-3xl">{onlineUsersCount}</div>
                </div>
                <div className="text-right">
                    <div className="text-green-400 text-lg">LIVE CLOCK</div>
                    <div className="text-3xl">
                        {time}
                    </div>
                </div>
            </div>

            {/* Stock Ticker Marquee */}
            <div className="bg-black border-y border-green-400/30 py-2 overflow-hidden">
                <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {stocks.concat(stocks).map((stock, index) => {
                        const change = (stock.price - stock.openingPrice) || 0;
                        const percent = stock.openingPrice > 0 ? (change / stock.openingPrice) * 100 : 0;
                        const isPositive = change >= 0;

                        return (
                            <div key={`${stock.ticker}-${index}`} className="flex items-center gap-2 text-lg">
                                <span className="text-white font-bold">{stock.ticker}</span>
                                <span className="text-white">${stock.price.toFixed(2)}</span>
                                <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPositive ? '+' : ''}{percent.toFixed(1)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex h-[calc(100vh-160px)]">
                {/* Stocks Panel - 60% */}
                <div className="w-4/5 p-6 border-r-2 border-green-400/30">
                    <h2 className="text-2xl font-bold text-green-400 mb-4 tracking-wider">MARKET PRICES</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {topStocks.map(stock => {
                            const { change, percent } = formatChange(stock);
                            const isPositive = change >= 0;
                            return (
                                <div key={stock.ticker} className="bg-green-900/10  px-4 py-2 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-2xl font-bold text-green-400">{stock.ticker}</div>
                                            <div className="text-sm text-white/60 truncate">{stock.name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl">{formatCurrency(stock.price)}</div>
                                            <div className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                {isPositive ? '+' : ''}{formatCurrency(change)} ({percent.toFixed(2)}%)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard Panel - 40% */}
                <div className="w-1/5 p-6">
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
                                    <div className="text-md font-medium">{user.name}</div>
                                </div>
                                <div className="text-xl font-bold text-green-400">{formatCurrency(user.assets)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDisplay;
