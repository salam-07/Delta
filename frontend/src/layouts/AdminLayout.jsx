import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useMarketStore } from '../store/useMarketStore';

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { marketOpen, fetchMarketStatus } = useMarketStore();

    useEffect(() => {
        fetchMarketStatus();
    }, [fetchMarketStatus]);

    return (
        <div className="flex h-screen text-white pt-10">
            {/* Admin Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white mr-4"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Market Status Indicator */}
                    <div className="flex items-center gap-2">
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

export default AdminLayout;
