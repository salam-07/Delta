import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, PieChart, RefreshCw } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import { useTradeStore } from "../../store/useTradeStore";
import { useMarketStore } from "../../store/useMarketStore";

const UserPortfolio = () => {
    const {
        portfolio,
        balance,
        viewPortfolio,
        checkBalance,
        getTotalAssets,
        getPortfolioValue,
        isLoadingPortfolio,
        isLoadingBalance
    } = useTradeStore();

    const { stocks, fetchAllStocks } = useMarketStore();

    useEffect(() => {
        viewPortfolio();
        checkBalance();
        fetchAllStocks();
    }, [viewPortfolio, checkBalance, fetchAllStocks]);

    // Calculate portfolio performance
    const portfolioValue = getPortfolioValue();
    const totalAssets = getTotalAssets();

    // Get current market prices for portfolio stocks
    const getStockCurrentPrice = (ticker) => {
        const stock = stocks.find(s => s.ticker === ticker);
        return stock ? parseFloat(stock.price) : 0;
    };

    // Calculate profit/loss for each stock
    const calculateStockPerformance = (portfolioStock) => {
        const currentPrice = getStockCurrentPrice(portfolioStock.ticker);
        const buyPrice = parseFloat(portfolioStock.tradePrice) || 0;
        const quantity = parseFloat(portfolioStock.amount) || 0;

        const currentValue = currentPrice * quantity;
        const investedValue = buyPrice * quantity;
        const profitLoss = currentValue - investedValue;
        const profitLossPercentage = investedValue > 0 ? ((profitLoss / investedValue) * 100) : 0;

        return {
            currentPrice,
            buyPrice,
            quantity,
            currentValue,
            investedValue,
            profitLoss,
            profitLossPercentage: profitLossPercentage.toFixed(2),
            isProfit: profitLoss >= 0
        };
    };

    const handleRefresh = () => {
        viewPortfolio();
        checkBalance();
        fetchAllStocks();
    };

    const isLoading = isLoadingPortfolio || isLoadingBalance;

    return (
        <UserLayout title="Portfolio Overview">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Portfolio Overview</h1>
                        <p className="text-gray-400 mt-1">Track your investments and performance</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Portfolio Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Portfolio Value */}
                    <div className=" p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium">Portfolio Value</p>
                                <p className="text-2xl font-bold text-white">
                                    {isLoading ? (
                                        <div className="w-24 h-8 animate-pulse"></div>
                                    ) : (
                                        `$${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    )}
                                </p>
                            </div>
                            <PieChart className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    {/* Cash Balance */}
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium">Cash Balance</p>
                                <p className="text-2xl font-bold text-white">
                                    {isLoading ? (
                                        <div className="w-24 h-8 animate-pulse rounded"></div>
                                    ) : (
                                        `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    )}
                                </p>
                            </div>
                            <Wallet className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    {/* Total Assets */}
                    <div className=" p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-400 text-sm font-medium">Net Worth</p>
                                <p className="text-2xl font-bold text-white">
                                    {isLoading ? (
                                        <div className="w-24 h-8 animate-pulse rounded"></div>
                                    ) : (
                                        `$${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    )}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Portfolio Holdings */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Your Holdings</h2>
                        <span className="text-sm text-gray-400">
                            {portfolio.length} {portfolio.length === 1 ? 'stock' : 'stocks'}
                        </span>
                    </div>

                    {isLoading && portfolio.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                <span>Loading portfolio...</span>
                            </div>
                        </div>
                    ) : portfolio.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <PieChart className="w-16 h-16 text-gray-600 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-300 mb-2">No Holdings Yet</h3>
                            <p className="text-gray-500 mb-6">Start trading to build your portfolio</p>
                            <button
                                onClick={() => window.location.href = '/home'}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Start Trading
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left text-gray-300 font-medium py-3 px-4">Stock</th>
                                        <th className="text-right text-gray-300 font-medium py-3 px-4">Shares</th>
                                        <th className="text-right text-gray-300 font-medium py-3 px-4">Avg. Price</th>
                                        <th className="text-right text-gray-300 font-medium py-3 px-4">Current Price</th>
                                        <th className="text-right text-gray-300 font-medium py-3 px-4">Market Value</th>
                                        <th className="text-right text-gray-300 font-medium py-3 px-4">P&L</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.map((holding, index) => {
                                        const performance = calculateStockPerformance(holding);
                                        const stock = stocks.find(s => s.ticker === holding.ticker);

                                        return (
                                            <tr key={`${holding.ticker}-${index}`} className="border-b border-gray-800 hover:bg-primary/5 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col">
                                                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-mono w-fit mb-1">
                                                            {holding.ticker}
                                                        </span>
                                                        <span className="text-gray-400 text-sm">
                                                            {stock?.name || 'Unknown Company'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-right text-white">
                                                    {performance.quantity.toLocaleString()}
                                                </td>
                                                <td className="py-4 px-4 text-right text-gray-300">
                                                    ${performance.buyPrice.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-4 text-right text-white font-medium">
                                                    ${performance.currentPrice.toFixed(2)}
                                                </td>
                                                <td className="py-4 px-4 text-right text-white font-semibold">
                                                    ${performance.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className={`flex items-center justify-end gap-1 ${performance.isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                                        {performance.isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                        <div className="text-right">
                                                            <div className="font-medium">
                                                                {performance.isProfit ? '+' : ''}${Math.abs(performance.profitLoss).toFixed(2)}
                                                            </div>
                                                            <div className="text-sm">
                                                                ({performance.isProfit ? '+' : ''}{performance.profitLossPercentage}%)
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
};

export default UserPortfolio;