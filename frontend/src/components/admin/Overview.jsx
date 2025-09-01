import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Minus, AlertCircle } from 'lucide-react';
import { useMarketStore } from '../../store/useMarketStore';
import { useAdminStore } from '../../store/useAdminStore';

const Overview = () => {
    const { marketOpen, toggleMarket, isMarketOpening } = useMarketStore();
    const { fetchAllStocks, stocks } = useAdminStore();


    // Fetch stocks on component mount
    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const latestDevelopment = {
        title: "Platform Update v2.1",
        content: "New trading features and improved user interface have been deployed. Users can now enjoy faster trade execution and enhanced portfolio management tools.",
        timestamp: "2 hours ago"
    };

    const handlePriceChange = (stockId, change) => {
        setStocks(prevStocks =>
            prevStocks.map(stock =>
                stock.id === stockId
                    ? { ...stock, price: Math.max(0, stock.price + change) }
                    : stock
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Market Control - Large Button */}
                <div className="lg:col-span-1">
                    <div className="p-6 rounded-lg h-full flex flex-col justify-center">
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">Market Control</h3>
                        <button
                            onClick={toggleMarket}
                            disabled={isMarketOpening}
                            className={`w-full h-32 rounded-lg font-bold text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${marketOpen
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {isMarketOpening ? 'UPDATING...' : (marketOpen ? 'CLOSE MARKET' : 'OPEN MARKET')}
                        </button>
                        <p className="text-sm text-gray-400 text-center mt-4">
                            Current Status: <span className={marketOpen ? 'text-green-400' : 'text-red-400'}>
                                {marketOpen ? 'Open' : 'Closed'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Stocks Overview */}
                <div className="lg:col-span-2">
                    <div className="p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-400 mb-4">Stock Prices</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {stocks.map((stock) => (
                                <div key={stock.id} className=" p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-green-400 font-bold text-lg">{stock.ticker}</span>
                                                <span className="text-gray-400 text-sm">{stock.name}</span>
                                            </div>
                                            <div className="text-white font-semibold text-xl mt-1">
                                                ${stock.price.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest Development News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-4">Latest Development</h3>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="text-white font-medium text-lg">{latestDevelopment.title}</h4>
                            <span className="text-gray-400 text-sm">{latestDevelopment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {latestDevelopment.content}
                        </p>
                        <button className="mt-4 text-green-400 hover:text-green-300 text-sm transition-colors">
                            Read more →
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-900/30 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Active Stocks</p>
                            <p className="text-white text-2xl font-bold">{stocks.length}</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Avg Price</p>
                            <p className="text-white text-2xl font-bold">
                                ${(stocks.reduce((sum, stock) => sum + stock.price, 0) / stocks.length).toFixed(0)}
                            </p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Market Status</p>
                            <p className={`text-xl font-bold ${marketOpen ? 'text-green-400' : 'text-red-400'}`}>
                                {marketOpen ? 'OPEN' : 'CLOSED'}
                            </p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Last Update</p>
                            <p className="text-white text-sm">{new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;