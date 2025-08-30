import { useState, useEffect } from "react";
import { Plus, TrendingUp, DollarSign, Edit, Trash2, RefreshCw } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";

const Stocks = () => {
    const { createStock, fetchAllStocks, stocks, isLoading } = useAdminStore();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        ticker: "",
        name: "",
        price: ""
    });

    // Fetch stocks on component mount
    useEffect(() => {
        fetchAllStocks();
    }, [fetchAllStocks]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.ticker || !formData.name || !formData.price) {
            return;
        }

        await createStock({
            ticker: formData.ticker.toUpperCase(),
            name: formData.name,
            price: parseFloat(formData.price)
        });

        // Reset form
        setFormData({ ticker: "", name: "", price: "" });
        setShowCreateForm(false);
    };

    const resetForm = () => {
        setFormData({ ticker: "", name: "", price: "" });
        setShowCreateForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Stock Management</h2>
                    <p className="text-gray-400 mt-1">Create and manage stocks in the system</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Create New Stock
                </button>
            </div>

            {/* Create Stock Form */}
            {showCreateForm && (
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-500" size={24} />
                        <h3 className="text-xl font-semibold text-white">Create New Stock</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Ticker Symbol */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ticker Symbol
                                </label>
                                <input
                                    type="text"
                                    name="ticker"
                                    value={formData.ticker}
                                    onChange={handleInputChange}
                                    placeholder="e.g., AAPL"
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none uppercase"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Apple Inc."
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Initial Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Initial Price ($)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0.01"
                                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Create Stock
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Stocks Section */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Existing Stocks</h3>
                    <button
                        onClick={() => fetchAllStocks()}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {isLoading && stocks.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            Loading stocks...
                        </div>
                    </div>
                ) : stocks.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                        No stocks found. Create your first stock using the form above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left text-gray-300 font-medium py-3 px-4">Ticker</th>
                                    <th className="text-left text-gray-300 font-medium py-3 px-4">Company Name</th>
                                    <th className="text-right text-gray-300 font-medium py-3 px-4">Current Price</th>
                                    <th className="text-left text-gray-300 font-medium py-3 px-4">Created</th>
                                    <th className="text-center text-gray-300 font-medium py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock) => (
                                    <tr key={stock._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-mono">
                                                {stock.ticker}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-white">{stock.name}</td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="text-green-400 font-semibold">
                                                ${stock.price.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-400 text-sm">
                                            {new Date(stock.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                                    title="Edit Price"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                                    title="Delete Stock"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stocks;