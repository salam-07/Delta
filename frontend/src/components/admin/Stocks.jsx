import { useState, useEffect } from "react";
import { Plus, TrendingUp, DollarSign } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import StockTable from "./common/StockTable";
import { useMarketStore } from "../../store/useMarketStore";


const Stocks = () => {
    const {
        createStock,
        deleteStock,
        deletingStockId,
        updateStock,
        creatingStock,
        updatingStock,
    } = useAdminStore();

    const {
        fetchAllStocks,
        stocks,
        fetchStock,
        stock,
        isStocksLoading,
        isStockLoading
    } = useMarketStore();

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

    const handleDelete = async (stockId) => {
        if (window.confirm("Are you sure you want to delete this stock? This action cannot be undone.")) {
            await deleteStock(stockId);
        }
    };

    const handlePriceIncrease = async (ticker, currentPrice, stockId, adjustmentValue) => {
        const newPrice = currentPrice + adjustmentValue;
        await updateStock({
            ticker: ticker,
            newPrice: newPrice
        });
    };

    const handlePriceDecrease = async (ticker, currentPrice, stockId, adjustmentValue) => {
        const newPrice = Math.max(0.01, currentPrice - adjustmentValue); // Ensure price doesn't go below 0.01
        await updateStock({
            ticker: ticker,
            newPrice: newPrice
        });
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
                </button>
            </div>

            {/* Create Stock Form */}
            {showCreateForm && (
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-500" size={24} />
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
                                className="border border-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Stocks Section */}
            <StockTable
                stocks={stocks}
                isLoading={isStocksLoading}
                onRefresh={fetchAllStocks}
                onPriceIncrease={handlePriceIncrease}
                onPriceDecrease={handlePriceDecrease}
                onDelete={handleDelete}
                updatingStock={updatingStock}
                deletingStockId={deletingStockId}
                showActions={true}
                showDeleteColumn={true}
                showRefreshButton={true}
                title="Existing Stocks"
            />
        </div>
    );
};

export default Stocks;