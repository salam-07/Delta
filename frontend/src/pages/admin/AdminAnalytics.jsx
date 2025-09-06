import React, { useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminStore } from '../../store/useAdminStore';

const StatCard = ({ title, value, subtitle, trend, icon }) => (
    <div className="">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-white/60">{title}</p>
                <p className="text-2xl font-bold text-green-400">{value}</p>
                {subtitle && (
                    <p className="text-sm text-white/80">{subtitle}</p>
                )}
            </div>
        </div>
        {trend && (
            <div className="mt-2">
                <span className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.positive ? '↗' : '↘'} {trend.value}
                </span>
            </div>
        )}
    </div>
);

const AdminAnalytics = () => {
    const { analytics, isAnalyticsLoading, getAnalytics } = useAdminStore();

    useEffect(() => {
        getAnalytics();
    }, [getAnalytics]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    if (isAnalyticsLoading) {
        return (
            <AdminLayout title="Analytics">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Analytics">
            <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={formatNumber(analytics?.overview?.totalUsers || 0)}
                    />
                    <StatCard
                        title="Total Trades"
                        value={formatNumber(analytics?.overview?.totalTrades || 0)}
                    />
                    <StatCard
                        title="Total Volume"
                        value={formatCurrency(analytics?.overview?.totalTradeVolume || 0)}
                    />
                    <StatCard
                        title="Market Status"
                        value={analytics?.overview?.marketOpen ? "OPEN" : "CLOSED"}
                        subtitle={`${analytics?.overview?.totalStocks || 0} stocks available`}
                    />
                </div>

                {/* User Metrics */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">User Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Active Investors</p>
                            <p className="text-xl font-bold">{analytics?.userMetrics?.totalInvestedUsers || 0}</p>
                            <p className="text-xs text-gray-500">
                                {analytics?.userMetrics?.tradingActivityRate || 0}% of users
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">With Portfolio</p>
                            <p className="text-xl font-bold">{analytics?.userMetrics?.usersWithPortfolio || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Trading & Financial Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Trading Activity</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Today's Trades:</span>
                                <span className="font-semibold">{analytics?.tradingMetrics?.tradesToday || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Buy Orders:</span>
                                <span className="font-semibold text-green-600">{analytics?.tradingMetrics?.buyTrades || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Sell Orders:</span>
                                <span className="font-semibold text-red-600">{analytics?.tradingMetrics?.sellTrades || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg Trade Size:</span>
                                <span className="font-semibold">{formatCurrency(analytics?.tradingMetrics?.averageTradeSize || 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Cash:</span>
                                <span className="font-semibold">{formatCurrency(analytics?.overview?.totalCashBalance || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Portfolio Value:</span>
                                <span className="font-semibold">{formatCurrency(analytics?.overview?.totalPortfolioValue || 0)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-900 font-medium">Total Assets:</span>
                                <span className="font-bold text-lg">{formatCurrency(analytics?.overview?.totalAssets || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock Performance */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Performance</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Market Overview</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stocks Rising:</span>
                                    <span className="text-green-600 font-semibold">{analytics?.stockMetrics?.stocksWithPriceIncrease || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stocks Falling:</span>
                                    <span className="text-red-600 font-semibold">{analytics?.stockMetrics?.stocksWithPriceDecrease || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Most Held Stock:</span>
                                    <span className="font-semibold">
                                        {analytics?.stockMetrics?.mostHeldStock?.ticker || 'N/A'}
                                        ({analytics?.stockMetrics?.mostHeldStock?.count || 0} holders)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Top Performers</h4>
                            <div className="space-y-2">
                                {analytics?.stockMetrics?.topPerformingStocks?.slice(0, 3).map((stock, index) => (
                                    <div key={stock.ticker} className="flex justify-between items-center">
                                        <span className="text-gray-700">{stock.ticker}</span>
                                        <span className={`font-semibold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trading Activity</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Trader</th>
                                    <th className="text-left py-2">Stock</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Amount</th>
                                    <th className="text-left py-2">Price</th>
                                    <th className="text-left py-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics?.recentActivity?.recentTrades?.map((trade, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{trade.traderName}</td>
                                        <td className="py-2">{trade.stockTicker}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {trade.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-2">{formatNumber(trade.amount)}</td>
                                        <td className="py-2">{formatCurrency(trade.price)}</td>
                                        <td className="py-2">{new Date(trade.date).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Content & System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Management</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Developments:</span>
                                <span className="font-semibold">{analytics?.contentMetrics?.totalDevelopments || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Published:</span>
                                <span className="font-semibold text-green-600">{analytics?.contentMetrics?.publishedDevelopments || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Drafts:</span>
                                <span className="font-semibold text-yellow-600">{analytics?.contentMetrics?.draftDevelopments || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Market Status:</span>
                                <span className={`font-semibold ${analytics?.systemHealth?.marketOpen ? 'text-green-600' : 'text-red-600'}`}>
                                    {analytics?.systemHealth?.marketOpen ? 'OPEN' : 'CLOSED'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Active Users:</span>
                                <span className="font-semibold">{analytics?.systemHealth?.activeUsersPercentage || 0}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg Daily Trades:</span>
                                <span className="font-semibold">{analytics?.systemHealth?.averageDailyTrades || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end">
                    <button
                        onClick={getAnalytics}
                        disabled={isAnalyticsLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isAnalyticsLoading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
        </AdminLayout >
    );
};

export default AdminAnalytics;