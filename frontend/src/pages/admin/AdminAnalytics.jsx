import React, { useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminStore } from '../../store/useAdminStore';
import { useSocketStore } from '../../store/useSocketStore';

const StatCard = ({ title, value, subtitle, trend, size = 'large' }) => (
    <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 p-6 rounded-lg hover:border-green-400/40 transition-all duration-300">
        <div className="space-y-2">
            <p className="text-white/70 text-sm font-medium tracking-wide uppercase">{title}</p>
            <p className={`font-bold text-green-400 ${size === 'xl' ? 'text-8xl' : size === 'large' ? 'text-6xl' : 'text-4xl'} leading-none`}>
                {value}
            </p>
            {subtitle && (
                <p className="text-white/60 text-sm">{subtitle}</p>
            )}
        </div>
        {trend && (
            <div className="mt-3 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${trend.positive ? 'bg-green-400' : 'bg-white/40'}`}></div>
                <span className={`text-sm font-medium ${trend.positive ? 'text-green-400' : 'text-white/60'}`}>
                    {trend.value}
                </span>
            </div>
        )}
    </div>
);

const MetricCard = ({ title, children }) => (
    <div className="bg-black/10 backdrop-blur-sm border border-green-500/10 p-6 rounded-lg">
        <h3 className="text-green-400 font-semibold text-lg mb-6 tracking-wide">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const MetricRow = ({ label, value, accent = false }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-white/70 text-sm">{label}</span>
        <span className={`font-bold text-lg ${accent ? 'text-green-400' : 'text-white'}`}>
            {value}
        </span>
    </div>
);

const AdminAnalytics = () => {
    const { analytics, isAnalyticsLoading, getAnalytics } = useAdminStore();
    const { onlineUsers } = useSocketStore();

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

    const formatCompact = (num) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(num);
    };

    // Memoized hero stats
    const formattedStats = useMemo(() => ([
        {
            title: 'Total System Value',
            value: formatCompact(analytics?.overview?.totalAssets || 0),
            subtitle: 'Combined portfolio and cash holdings',
            size: 'xl',
        },
        {
            title: 'Trading Volume',
            value: formatCompact(analytics?.overview?.totalTradeVolume || 0),
            subtitle: 'All-time cumulative volume',
            size: 'xl',
        },
    ]), [analytics]);

    // Memoized overview grid
    const overviewStats = useMemo(() => ([
        {
            title: 'Active Users',
            value: formatNumber(analytics?.overview?.totalUsers || 0),
            subtitle: 'Total registered users',
            trend: {
                positive: (analytics?.userMetrics?.userGrowthRate || 0) > 0,
                value: `${analytics?.userMetrics?.userGrowthRate || 0}% growth`,
            },
        },
        {
            title: 'Total Trades',
            value: formatNumber(analytics?.overview?.totalTrades || 0),
            subtitle: 'All trades executed',
        },
        {
            title: 'Listed Stocks',
            value: formatNumber(analytics?.overview?.totalStocks || 0),
            subtitle: `${analytics?.stockMetrics?.stocksWithPriceIncrease || 0} currently rising`,
        },
        {
            title: 'Market',
            value: analytics?.overview?.marketOpen ? 'OPEN' : 'CLOSED',
            subtitle: 'Trading Status',
            trend: {
                positive: analytics?.overview?.marketOpen,
                value: analytics?.overview?.marketOpen ? 'Active trading' : 'Market closed',
            },
        },
    ]), [analytics]);

    // Memoized metric card data
    const userMetrics = useMemo(() => ([
        { label: 'Total Registered', value: formatNumber(analytics?.userMetrics?.totalUsers || 0), accent: true },
        { label: 'Active Investors', value: formatNumber(analytics?.userMetrics?.totalInvestedUsers || 0) },
        { label: 'Investment Rate', value: `${analytics?.userMetrics?.tradingActivityRate || 0}%` },
        { label: 'With Portfolios', value: formatNumber(analytics?.userMetrics?.usersWithPortfolio || 0) },
    ]), [analytics]);

    const tradingMetrics = useMemo(() => ([
        { label: 'Total Volume', value: formatCurrency(analytics?.overview?.totalTradeVolume || 0), accent: true },
        { label: 'Total Trades', value: formatNumber(analytics?.overview?.totalTrades || 0) },
        { label: 'Buy Orders', value: formatNumber(analytics?.tradingMetrics?.buyTrades || 0) },
        { label: 'Sell Orders', value: formatNumber(analytics?.tradingMetrics?.sellTrades || 0) },
        { label: 'Avg Trade Size', value: formatCurrency(analytics?.tradingMetrics?.averageTradeSize || 0) },
    ]), [analytics]);

    const marketHealth = useMemo(() => ([
        { label: 'Total Cash', value: formatCurrency(analytics?.overview?.totalCashBalance || 0), accent: true },
        { label: 'Portfolio Value', value: formatCurrency(analytics?.overview?.totalPortfolioValue || 0) },
        { label: 'Stocks Rising', value: formatNumber(analytics?.stockMetrics?.stocksWithPriceIncrease || 0) },
        { label: 'Stocks Falling', value: formatNumber(analytics?.stockMetrics?.stocksWithPriceDecrease || 0) },
    ]), [analytics]);

    // Memoized top stocks
    const topStocks = useMemo(() => analytics?.stockMetrics?.topPerformingStocks?.slice(0, 3) || [], [analytics]);
    const mostHeldStock = useMemo(() => analytics?.stockMetrics?.mostHeldStock, [analytics]);

    if (isAnalyticsLoading) {
        return (
            <AdminLayout title="Analytics">
                <div className="flex justify-center items-center h-96">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-2 border-green-400/20"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-green-400 absolute top-0"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Analytics">
            <div className="space-y-8">
                {/* Hero Stats */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {formattedStats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {overviewStats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <MetricCard title="User Analytics">
                        {userMetrics.map((row) => (
                            <MetricRow key={row.label} {...row} />
                        ))}
                    </MetricCard>
                    <MetricCard title="Trading Activity">
                        {tradingMetrics.map((row) => (
                            <MetricRow key={row.label} {...row} />
                        ))}
                    </MetricCard>
                    <MetricCard title="Market Health">
                        {marketHealth.map((row) => (
                            <MetricRow key={row.label} {...row} />
                        ))}
                    </MetricCard>
                </div>

                {/* Top Performing Stocks */}
                <MetricCard title="Top Performing Stocks">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {topStocks.map((stock) => (
                            <div key={stock.ticker} className="bg-black/10 p-4 rounded-lg border border-green-500/10">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-green-400 font-bold text-lg">{stock.ticker}</p>
                                        <p className="text-white/60 text-sm">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold">{formatCurrency(stock.currentPrice)}</p>
                                        <p className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-green-400' : 'text-white/60'}`}>
                                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div
                                        className={`h-1 rounded-full ${stock.changePercent >= 0 ? 'bg-green-400' : 'bg-white/20'}`}
                                        style={{ width: `${Math.min(100, Math.abs(stock.changePercent) * 10)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {mostHeldStock?.ticker && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <MetricRow
                                label="Most Held Stock"
                                value={`${mostHeldStock.ticker} (${mostHeldStock.count} holders)`}
                                accent
                            />
                        </div>
                    )}
                </MetricCard>

                {/* System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <MetricCard title="Content Management">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-green-400 mb-2">
                                    {analytics?.contentMetrics?.totalDevelopments || 0}
                                </p>
                                <p className="text-white/70 text-sm">Total Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-green-400 mb-2">
                                    {analytics?.contentMetrics?.publishedDevelopments || 0}
                                </p>
                                <p className="text-white/70 text-sm">Published</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-white mb-2">
                                    {analytics?.contentMetrics?.draftDevelopments || 0}
                                </p>
                                <p className="text-white/70 text-sm">Drafts</p>
                            </div>
                        </div>
                    </MetricCard>

                    <MetricCard title="System Health">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-white/70">Market Status</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${analytics?.systemHealth?.marketOpen ? 'bg-green-400' : 'bg-white/40'}`}></div>
                                    <span className={`font-bold ${analytics?.systemHealth?.marketOpen ? 'text-green-400' : 'text-white'}`}>
                                        {analytics?.systemHealth?.marketOpen ? 'OPERATIONAL' : 'CLOSED'}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg">
                                <p className="text-6xl font-bold text-green-400 mb-2">
                                    {onlineUsers.length}
                                </p>
                                <p className="text-white/70 text-sm">Users Online Now</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg">
                                <p className="text-6xl font-bold text-green-400 mb-2">
                                    {analytics?.systemHealth?.activeUsersPercentage || 0}%
                                </p>
                                <p className="text-white/70 text-sm">User Engagement Rate</p>
                            </div>
                        </div>
                    </MetricCard>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-6">
                    <button
                        onClick={getAnalytics}
                        disabled={isAnalyticsLoading}
                        className="px-8 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg font-medium hover:bg-green-500/30 hover:border-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isAnalyticsLoading ? 'Refreshing Analytics...' : 'Refresh Data'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAnalytics;
