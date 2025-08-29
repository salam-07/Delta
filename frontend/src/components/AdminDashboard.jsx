import { useState } from 'react';
import {
    Users,
    TrendingUp,
    Settings,
    BarChart3,
    FileText,
    DollarSign,
    Menu,
    X,
    Home
} from 'lucide-react';

// Import admin components
import Overview from './admin/Overview';
import UsersComponent from './admin/Users';
import Stocks from './admin/Stocks';
import Trades from './admin/Trades';
import Developments from './admin/Developments';
import Analytics from './admin/Analytics';
import SettingsComponent from './admin/Settings';
import MarqueeText from './admin/MarqueeText';

import useAuthStore from '../store/useAuthStore';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { authUser } = useAuthStore();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'users', label: 'Manage Participants', icon: Users },
        { id: 'stocks', label: 'Manage Stocks', icon: TrendingUp },
        { id: 'trades', label: 'View Trades', icon: BarChart3 },
        { id: 'developments', label: 'Developments', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: DollarSign },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Function to render the appropriate component based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview />;
            case 'users':
                return <UsersComponent />;
            case 'stocks':
                return <Stocks />;
            case 'trades':
                return <Trades />;
            case 'developments':
                return <Developments />;
            case 'analytics':
                return <Analytics />;
            case 'settings':
                return <SettingsComponent />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex h-screen text-white">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-inherit backdrop-blur-lg shadow-lg
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6">
                    <h1 className="text-xl font-bold text-green-400">Admin Dashboard</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`
                                    w-full flex items-center px-6 py-3 text-left transition-colors
                                    ${activeTab === item.id
                                        ? 'bg-green-500/10 text-green-400 border-r-2 border-green-500'
                                        : 'text-gray-300 hover:text-primary'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:bottom-16">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-black">A</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{authUser.fullName}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

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
                        <h2 className="text-xl font-semibold capitalize">
                            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                </header>

                {/* Market Status Marquee */}
                <MarqueeText />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">{/* Added mt-8 for spacing below marquee */}
                    <div className="max-w-7xl mx-auto">
                        {/* Dynamic Content Based on Active Tab */}
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div >
    );
};

export default AdminDashboard;