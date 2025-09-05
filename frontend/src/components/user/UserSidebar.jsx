import { Link, useLocation } from 'react-router-dom';
import {
    FileText,
    X,
    Landmark,
    CircleDollarSign,
    ChartLine,
    History,
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { authUser } = useAuthStore();

    const menuItems = [
        { id: 'market', label: 'Market', icon: Landmark, path: '/user' },
        { id: 'portfolio', label: 'Portfolio', icon: CircleDollarSign, path: '/user/portfolio' },
        { id: 'trade', label: 'Buy and Sell Stocks', icon: ChartLine, path: '/user/trade' },
        { id: 'developments', label: 'Developments', icon: FileText, path: '/user/developments' },
        { id: 'history', label: 'Trading History', icon: History, path: '/user/history' },
    ];

    const isActiveRoute = (path) => {
        if (path === '/user') {
            return location.pathname === '/user';
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
                pt-10 fixed inset-y-0 left-0 z-30 w-64 bg-inherit backdrop-blur-lg shadow-lg
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            `}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6">
                    <h1 className="text-xl font-bold text-green-400">Trader Dashboard</h1>
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
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-black">{authUser?.fullName[0].toUpperCase()}</span>
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

export default AdminSidebar;
