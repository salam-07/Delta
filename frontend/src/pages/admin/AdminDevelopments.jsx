import { useState, useEffect } from "react";
import { Plus, FileText, X, DollarSign } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { useMarketStore } from "../../store/useMarketStore";
import DevTable from "../../components/admin/AdminDevTable";
import AdminLayout from "../../layouts/AdminLayout";

const AdminDevelopments = () => {
    const {
        createDev,
        deleteDev,
        postDev,
        deletingDevId,
        updateDev,
        creatingDev,
        updatingDev,
        postingDev,
    } = useAdminStore();

    const {
        fetchAllDev,
        devs,
        fetchDev,
        dev,
        isDevsLoading,
        isDevLoading,
        fetchAllStocks,
        stocks,
        isStocksLoading
    } = useMarketStore();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingDev, setEditingDev] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        stockPriceChanges: []
    });

    // Fetch data on component mount
    useEffect(() => {
        fetchAllDev();
        fetchAllStocks(); // Fetch stocks for price changes
    }, [fetchAllDev, fetchAllStocks]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStockPriceChange = (stockId, ticker, newPrice) => {
        setFormData(prev => {
            const existingIndex = prev.stockPriceChanges.findIndex(change => change.stockId === stockId);
            const updatedChanges = [...prev.stockPriceChanges];

            if (newPrice === "" || newPrice === null) {
                // Remove the stock price change if price is empty
                if (existingIndex > -1) {
                    updatedChanges.splice(existingIndex, 1);
                }
            } else {
                const changeData = {
                    stockId,
                    ticker,
                    newPrice: parseFloat(newPrice)
                };

                if (existingIndex > -1) {
                    // Update existing
                    updatedChanges[existingIndex] = changeData;
                } else {
                    // Add new
                    updatedChanges.push(changeData);
                }
            }

            return {
                ...prev,
                stockPriceChanges: updatedChanges
            };
        });
    };

    const getStockPriceValue = (stockId) => {
        const change = formData.stockPriceChanges.find(change => change.stockId === stockId);
        return change ? change.newPrice : "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            return;
        }

        await createDev({
            title: formData.title,
            content: formData.content,
            stockPriceChanges: formData.stockPriceChanges
        });

        // Reset form
        setFormData({
            title: "",
            content: "",
            stockPriceChanges: []
        });
        setShowCreateForm(false);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            stockPriceChanges: []
        });
        setShowCreateForm(false);
    };

    const handleEdit = (dev) => {
        setEditingDev(dev);
        setFormData({
            title: dev.title || "",
            content: dev.content || "",
            stockPriceChanges: dev.stockPriceChanges || []
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!formData.content) {
            return;
        }

        await updateDev(editingDev._id, {
            title: formData.title,
            content: formData.content,
            stockPriceChanges: formData.stockPriceChanges
        });

        // Reset form
        setFormData({
            title: "",
            content: "",
            stockPriceChanges: []
        });
        setShowEditForm(false);
        setEditingDev(null);
    };

    const resetEditForm = () => {
        setFormData({
            title: "",
            content: "",
            stockPriceChanges: []
        });
        setShowEditForm(false);
        setEditingDev(null);
    };

    const handleDelete = async (devId) => {
        if (window.confirm("Are you sure you want to delete this development? This action cannot be undone.")) {
            await deleteDev(devId);
        }
    };

    const handleToggleStatus = async (devId, currentStatus) => {
        // Convert currentStatus string to boolean and invert it
        const newStatus = currentStatus === 'draft'; // draft becomes true (published), published becomes false (draft)
        await postDev(devId, { status: newStatus });
        // Refresh the developments list to show updated status
        fetchAllDev();
    };

    return (
        <AdminLayout title="Development Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Development Management</h2>
                        <p className="text-gray-400 mt-1">Create and manage developments</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Create Development Form */}
                {showCreateForm && (
                    <div className="backdrop-blur-sm rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="text-green-500" size={24} />
                            <h3 className="text-xl font-semibold text-white">Create New Development</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Development Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Development Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter development title..."
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Development Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Enter development content..."
                                        rows={6}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-y"
                                        required
                                    />
                                </div>

                                {/* Stock Price Changes Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <DollarSign className="text-yellow-500" size={20} />
                                        <label className="block text-sm font-medium text-gray-300">
                                            Stock Price Changes (Optional)
                                        </label>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Set new prices for stocks that will be applied when this development is posted.
                                    </p>

                                    {isStocksLoading ? (
                                        <div className="text-gray-400 text-center py-4">
                                            Loading stocks...
                                        </div>
                                    ) : (
                                        <div className="bg-gray-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            {stocks && stocks.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {stocks.map((stock) => (
                                                        <div key={stock._id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                                                            <div className="flex-1">
                                                                <div className="text-white font-medium">{stock.ticker}</div>
                                                                <div className="text-gray-400 text-sm">{stock.name}</div>
                                                                <div className="text-gray-500 text-xs">Current: ${stock.price}</div>
                                                            </div>
                                                            <div className="flex-shrink-0 ml-3">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    placeholder="New price"
                                                                    value={getStockPriceValue(stock._id)}
                                                                    onChange={(e) => handleStockPriceChange(stock._id, stock.ticker, e.target.value)}
                                                                    className="w-24 bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-yellow-500 focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 text-center py-4">
                                                    No stocks available
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {formData.stockPriceChanges.length > 0 && (
                                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="text-yellow-400 text-sm font-medium mb-2">
                                                Stock Price Changes ({formData.stockPriceChanges.length})
                                            </div>
                                            <div className="space-y-1">
                                                {formData.stockPriceChanges.map((change) => (
                                                    <div key={change.stockId} className="text-gray-300 text-sm">
                                                        {change.ticker}: ${change.newPrice}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                                <button
                                    type="submit"
                                    disabled={creatingDev}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {creatingDev ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Development
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit Development Form */}
                {showEditForm && editingDev && (
                    <div className="backdrop-blur-sm rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileText className="text-yellow-500" size={24} />
                            <h3 className="text-xl font-semibold text-white">Edit Development</h3>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Development Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Development Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter development title..."
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                                    />
                                </div>

                                {/* Development Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Enter development content..."
                                        rows={6}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-y"
                                        required
                                    />
                                </div>

                                {/* Stock Price Changes Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <DollarSign className="text-yellow-500" size={20} />
                                        <label className="block text-sm font-medium text-gray-300">
                                            Stock Price Changes (Optional)
                                        </label>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Set new prices for stocks that will be applied when this development is posted.
                                    </p>

                                    {isStocksLoading ? (
                                        <div className="text-gray-400 text-center py-4">
                                            Loading stocks...
                                        </div>
                                    ) : (
                                        <div className="bg-gray-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            {stocks && stocks.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {stocks.map((stock) => (
                                                        <div key={stock._id} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                                                            <div className="flex-1">
                                                                <div className="text-white font-medium">{stock.ticker}</div>
                                                                <div className="text-gray-400 text-sm">{stock.name}</div>
                                                                <div className="text-gray-500 text-xs">Current: ${stock.price}</div>
                                                            </div>
                                                            <div className="flex-shrink-0 ml-3">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    placeholder="New price"
                                                                    value={getStockPriceValue(stock._id)}
                                                                    onChange={(e) => handleStockPriceChange(stock._id, stock.ticker, e.target.value)}
                                                                    className="w-24 bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-yellow-500 focus:outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 text-center py-4">
                                                    No stocks available
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {formData.stockPriceChanges.length > 0 && (
                                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="text-yellow-400 text-sm font-medium mb-2">
                                                Stock Price Changes ({formData.stockPriceChanges.length})
                                            </div>
                                            <div className="space-y-1">
                                                {formData.stockPriceChanges.map((change) => (
                                                    <div key={change.stockId} className="text-gray-300 text-sm">
                                                        {change.ticker}: ${change.newPrice}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                                <button
                                    type="submit"
                                    disabled={updatingDev}
                                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    {updatingDev ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={18} />
                                            Update Development
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetEditForm}
                                    className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Developments Grid Section */}
                <DevTable
                    devs={devs}
                    isLoading={isDevsLoading}
                    onRefresh={fetchAllDev}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showRefreshButton={true}
                    title="All Developments"
                />
            </div>
        </AdminLayout>
    );
};

export default AdminDevelopments;
