import { useEffect, useState, useMemo } from 'react';
import { Users, DollarSign, TrendingUp, Eye, Search, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAdminStore } from '../../store/useAdminStore';
import { useMarketStore } from '../../store/useMarketStore';

const AdminUsers = () => {
    const { users, isUsersLoading, getAllUsers } = useAdminStore();
    const { stocks, fetchAllStocks } = useMarketStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('totalAssets'); // email, name, balance, totalAssets
    const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
    const [visibleUsers, setVisibleUsers] = useState(20); // For lazy loading

    useEffect(() => {
        getAllUsers();
        fetchAllStocks();
    }, [getAllUsers, fetchAllStocks]);

    // Calculate total assets for each user (balance + portfolio value)
    const enrichedUsers = useMemo(() => {
        if (!users.length || !stocks.length) return [];

        return users.map(user => {
            // Calculate portfolio value
            const portfolioValue = user.portfolio?.reduce((total, holding) => {
                const stock = stocks.find(s => s.ticker === holding.ticker);
                const currentPrice = stock ? parseFloat(stock.price) : 0;
                const quantity = parseFloat(holding.amount) || 0;
                return total + (currentPrice * quantity);
            }, 0) || 0;

            const totalAssets = (user.balance || 0) + portfolioValue;

            return {
                ...user,
                portfolioValue,
                totalAssets,
                holdingsCount: user.portfolio?.length || 0
            };
        });
    }, [users, stocks]);

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = enrichedUsers.filter(user =>
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort users
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [enrichedUsers, searchTerm, sortBy, sortOrder]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const loadMoreUsers = () => {
        setVisibleUsers(prev => prev + 20);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <AdminLayout title="Users Management">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-400" size={24} />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Users Management</h1>
                            <p className="text-xs text-gray-400">
                                {filteredAndSortedUsers.length} users • Total Assets: {formatCurrency(
                                    filteredAndSortedUsers.reduce((sum, user) => sum + user.totalAssets, 0)
                                )}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            getAllUsers();
                            fetchAllStocks();
                        }}
                        disabled={isUsersLoading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                        <RefreshCw size={14} className={isUsersLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Search and Controls */}
                <div className="flex gap-3 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 focus:outline-none"
                    >
                        <option value="totalAssets">Sort by Total Assets</option>
                        <option value="balance">Sort by Balance</option>
                        <option value="portfolioValue">Sort by Portfolio Value</option>
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                    </select>
                </div>

                {/* Users Table */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                    {isUsersLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="ml-2 text-gray-400 text-sm">Loading users...</span>
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="bg-gray-800 border-b border-gray-700">
                                <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    <div
                                        className="col-span-3 cursor-pointer hover:text-white flex items-center gap-1"
                                        onClick={() => handleSort('name')}
                                    >
                                        User Info {getSortIcon('name')}
                                    </div>
                                    <div
                                        className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1"
                                        onClick={() => handleSort('email')}
                                    >
                                        Email {getSortIcon('email')}
                                    </div>
                                    <div
                                        className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1 text-right"
                                        onClick={() => handleSort('balance')}
                                    >
                                        Balance {getSortIcon('balance')}
                                    </div>
                                    <div
                                        className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1 text-right"
                                        onClick={() => handleSort('portfolioValue')}
                                    >
                                        Portfolio {getSortIcon('portfolioValue')}
                                    </div>
                                    <div
                                        className="col-span-2 cursor-pointer hover:text-white flex items-center gap-1 text-right"
                                        onClick={() => handleSort('totalAssets')}
                                    >
                                        Total Assets {getSortIcon('totalAssets')}
                                    </div>
                                    <div className="col-span-1 text-center">Holdings</div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-800">
                                {filteredAndSortedUsers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-sm font-medium text-gray-300 mb-2">No Users Found</h3>
                                        <p className="text-xs text-gray-500">
                                            {searchTerm ? 'Try adjusting your search criteria' : 'No users in the system yet'}
                                        </p>
                                    </div>
                                ) : (
                                    filteredAndSortedUsers.slice(0, visibleUsers).map((user) => (
                                        <div key={user._id} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-800/50 transition-colors">
                                            {/* User Info */}
                                            <div className="col-span-3">
                                                <div className="text-xs font-medium text-white truncate">
                                                    {user.fullName || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">
                                                    ID: {user._id.slice(-8)}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="col-span-2">
                                                <div className="text-xs text-gray-300 truncate">
                                                    {user.email}
                                                </div>
                                            </div>

                                            {/* Balance */}
                                            <div className="col-span-2 text-right">
                                                <div className="text-xs font-medium text-green-400">
                                                    {formatCurrency(user.balance)}
                                                </div>
                                            </div>

                                            {/* Portfolio Value */}
                                            <div className="col-span-2 text-right">
                                                <div className="text-xs font-medium text-blue-400">
                                                    {formatCurrency(user.portfolioValue)}
                                                </div>
                                            </div>

                                            {/* Total Assets */}
                                            <div className="col-span-2 text-right">
                                                <div className="text-xs font-bold text-yellow-400">
                                                    {formatCurrency(user.totalAssets)}
                                                </div>
                                            </div>

                                            {/* Holdings Count */}
                                            <div className="col-span-1 text-center">
                                                <div className="text-xs text-gray-400">
                                                    {user.holdingsCount}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Load More Button */}
                            {visibleUsers < filteredAndSortedUsers.length && (
                                <div className="border-t border-gray-700 p-4 text-center">
                                    <button
                                        onClick={loadMoreUsers}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs transition-colors"
                                    >
                                        Load More ({filteredAndSortedUsers.length - visibleUsers} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="text-blue-400" size={16} />
                            <span className="text-xs font-medium text-gray-400">Total Users</span>
                        </div>
                        <div className="text-xl font-bold text-white">{enrichedUsers.length}</div>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="text-green-400" size={16} />
                            <span className="text-xs font-medium text-gray-400">Total Balance</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                            {formatCurrency(enrichedUsers.reduce((sum, user) => sum + (user.balance || 0), 0))}
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-blue-400" size={16} />
                            <span className="text-xs font-medium text-gray-400">Total Portfolio</span>
                        </div>
                        <div className="text-lg font-bold text-blue-400">
                            {formatCurrency(enrichedUsers.reduce((sum, user) => sum + user.portfolioValue, 0))}
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="text-yellow-400" size={16} />
                            <span className="text-xs font-medium text-gray-400">Total Assets</span>
                        </div>
                        <div className="text-lg font-bold text-yellow-400">
                            {formatCurrency(enrichedUsers.reduce((sum, user) => sum + user.totalAssets, 0))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;