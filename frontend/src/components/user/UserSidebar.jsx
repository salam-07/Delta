import { Link, useLocation } from 'react-router-dom';
import {
    TrendingUp,
    Settings,
    BarChart3,
    FileText,
    DollarSign,
    X,
    Home,
    Briefcase,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const UserSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { authUser } = useAuthStore();

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: Home, path: '/home' },
        { id: 'market', label: 'Market', icon: TrendingUp, path: '/home/market' },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/home/portfolio' },
        { id: 'trade', label: 'Trade', icon: BarChart3, path: '/home/trade' },
        { id: 'developments', label: 'Developments', icon: FileText, path: '/home/developments' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/home/settings' },
    ];

    const isActiveRoute = (path) => {
        if (path === '/home') {
            return location.pathname === '/home';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
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
                    <h1 className="text-xl font-bold text-green-400">Trading Portal</h1>
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
                        const isActive = isActiveRoute(item.path);
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    w-full flex items-center px-6 py-3 text-left transition-colors
                                    ${isActive
                                        ? 'bg-green-500/10 text-green-400 border-r-2 border-green-500'
                                        : 'text-gray-300 hover:text-primary'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:bottom-16">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-black">
                                {authUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{authUser?.fullName}</p>
                            <p className="text-xs text-gray-400">Trader</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserSidebar;
