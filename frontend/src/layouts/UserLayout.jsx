import { useState, useEffect } from 'react';
import { Menu, DollarSign, Wallet } from 'lucide-react';
import UserSidebar from "../components/user/UserSidebar";
import { useMarketStore } from '../store/useMarketStore';
import { useTradeStore } from '../store/useTradeStore';

const UserLayout = ({ children, title = "Trader Dashboard" }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { marketOpen } = useMarketStore();
    const { balance, getTotalAssets, checkBalance, viewPortfolio, isLoadingBalance, isLoadingPortfolio } = useTradeStore();

    // Initialize data on mount
    useEffect(() => {
        checkBalance();
        viewPortfolio();
    }, [checkBalance, viewPortfolio]);

    const totalAssets = getTotalAssets();

    return (
        <div className="flex h-screen text-white pt-10">
            {/* Admin Sidebar */}
            <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white mr-4"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Market Status Indicator */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3">
                            <div className="flex flex-col">
                                <span className="text-md text-white">
                                    {isLoadingBalance || isLoadingPortfolio ? (
                                        <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                                    ) : (
                                        `Net Worth: $${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3">
                            <div className="flex flex-col">
                                <span className="text-md text-white">
                                    {isLoadingBalance ? (
                                        <div className="w-12 h-4 bg-gray-700 animate-pulse rounded"></div>
                                    ) : (
                                        `Cash: $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${marketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                }`}></div>
                            <span className={`text-sm font-medium ${marketOpen ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {marketOpen ? 'Market Open' : 'Market Closed'}
                            </span>
                        </div>

                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
