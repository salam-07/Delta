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

    return (
        <div className="space-y-6">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Market Control - Large Button */}
                <div className="lg:col-span-1">
                    <div className="p-6 rounded-lg h-full flex flex-col justify-center">
                        <h3 className="text-lg font-semibold text-white mb-4 text-center">Control Market Status</h3>
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

                <div className="lg:col-span-1">

                </div>

            </div>
        </div>
    );
};

export default Overview;